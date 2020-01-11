<template>
  <div
    style="height:100%;"
    v-loading="team.length <= 0"
    element-loading-text="Loading team members please wait..."
  >
    <Title title="Schedule" subtitle="View your calendar" />
    <el-row v-loading="loading" type="flex">
      <el-col class="pl-3 pr-3">
        <el-row class="mb-4" type="flex" :gutter="10" align="middle">
          <!-- <el-col>
            <el-input
              style="border-radius:40px"
              placeholder="Search Team Member"
              size="small"
              v-model="searchedTeamMember"
            ></el-input>
          </el-col>-->
          <el-col>
            <el-button
              @click="modals.create_event = true"
              round
              type="primary"
              size="small"
            >
              {{ getIsAdmin ? "Create Event" : "Create Request" }}
              <i class="el-icon-plus"></i>
            </el-button>
            <el-button
              v-if="getIsAdmin"
              round
              type="primary"
              size="small"
              @click="modals.create_employee = true"
            >
              Create Employee
              <i class="el-icon-plus"></i>
            </el-button>
          </el-col>
        </el-row>
        <ScheduleCalendar
          @displayCreateShift="modals.create_event = $event"
          style="height:60%"
        />
      </el-col>
    </el-row>

    <CreateShift
      @toggle="modals.create_event = $event"
      @createEvent="createEvent"
      :display="modals.create_event"
    />
    <CreateEmployee
      @toggle="modals.create_employee = $event"
      :display="modals.create_employee"
    />
  </div>
</template>

<script>
import dates from "@/mixins/dates";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import CreateShift from "./components/CreateShift";
import CreateEmployee from "./components/CreateEmployee";

import Dropdown from "@/components/Dropdown.vue";
import Popover from "@/components/Popover";
import ScheduleCalendar from "./components/ScheduleCalendar";
export default {
  name: "Schedule",
  data() {
    return {
      loading: false,
      liveSchedule: false,
      scheduleInterval: null,
      searchedTeamMember: "",
      filters: {
        employee: "",
        abscences: "",
        holidays: "",
        late: ""
      },
      modals: {
        create_event: false,
        edit_event: false,
        view_profile: false,
        export_profile: false,
        export_schedule: false,
        create_employee: false
      },

      currentView: "",
      dateFormat: "DD MMMM"
    };
  },

  computed: {
    ...mapState("Admin", ["team"]),
    ...mapGetters(["getIsAdmin"]),
    filteredTeam() {
      return this.team.filter(x => {
        x.name == this.searchedTeamMember;
      });
    },
    items() {
      const isAdmin = this.getIsAdmin;
      let items = [
        {
          name: isAdmin ? "Create Event" : "Create Request",
          command: "create_event"
        },

        {
          name: isAdmin ? "Update / Remove Event" : "Update / Remove Request",
          command: "edit_event"
        },
        {
          name: "Create Employee",
          command: "create_employee",
          divided: true
        },
        {
          name: "Export Employee",
          command: "export_employee"
        },
        {
          name: "Export Schedule",
          command: "export_schedule"
        }
      ];
      // if(this.getIsAdmin){
      //      items = items.mp(item=>{
      //        let command = item.command;
      //       command == 'Create Employee' || command == 'Export Employee'
      //      })
      // }
      return items;
    },

    viewSelectionConfig() {
      return [
        { name: "Month", value: "month" },
        { name: "Week", value: "week" },
        { name: "Day", value: "day" }
      ];
    },
    filterConfig() {
      let filters = [];
      for (let filter in this.filters) {
        filters.push(filter);
      }
      return filters;
    },
    formConfig() {
      return [
        {
          label: "Assign To and Date",
          items: { name: "", model: "", component: "" }
        }
      ];
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    createEmployee(employeeData) {},
    createEvent(eventData) {
      this.loading = true;
      this.modals.createEvent = false;

      const date = {
        start: new Date(eventData.date[0]).toISOString(),
        end: new Date(eventData.date[1]).toISOString()
      };

      // check the dates if before today and create errors
      for (let property in date) {
        if (this.isBefore(date[property], true, null)) {
          this.loading = false;
          return this.UPDATE_NOTIFICATIONS({
            type: "error",
            message: "Events cannot be scheduled before now."
          });
          break;
        }
      }

      const payload = {
        url: "/shifts/create",
        method: "POST",
        data: {
          startDate: date.start,
          endDate: date.end,
          shift_type: eventData.shift_type,
          assigned_to: eventData.assigned_to
        }
      };

      this.request(payload)
        .then(response => {
          this.loading = false;
          if (this.getIsAdmin) {
            this.UPDATE_NOTIFICATIONS({
              type: "success",
              message:
                "Event successfully created, it will appear in your dashboard and schedule shortly."
            });
          }
          this.getShifts();
        })
        .catch(error => {
          this.loading = false;
        });
    },
    displayModals(command) {
      console.log(command);
      this.modals[command] = true;
    }
  },
  mixins: [dates],

  components: {
    Title: () => import("@/components/Title"),
    ScheduleCalendar,
    CreateShift,
    Dropdown,
    Popover,
    CreateEmployee
  }
};
</script>

<style lang="scss" scoped>
.view_indicator {
  text-transform: capitalize;
}
.sidebar {
  background: rgb(253, 253, 253);
  height: 100vh;
}
span {
  font-size: 1.2em;
}
.vuecal {
  box-shadow: none;
}
.checkbox {
  text-transform: capitalize;
}
.view_indicator {
  color: $primary_colour;
}
.time_wrapper {
  background: rgb(253, 253, 253);
  color: #999;
  border-radius: 40px;
  font-size: 0.9em;
}
.icon {
  cursor: pointer;
}
</style>
