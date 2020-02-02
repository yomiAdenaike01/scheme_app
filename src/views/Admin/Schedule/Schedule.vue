<template>
  <el-row
    class="schedule_container"
    v-loading="false"
    element-loading-text="Loading team members please wait..."
  >
    <Title title="Schedule" subtitle="View your calendar" />

    <Toolbar @modalChanges="self['modals'][$event] = true" class="m-3" />

    <ScheduleCalendar
      @refreshShift="getShifts"
      @displayCreateShift="modals['create_event'] = $event"
      :ScheduleFilters="filters['schedule_view']"
      class="schedule_cal_container"
    />
    <!-- Create views -->
    <CreateShift
      @toggle="modals['create_event'] = $event"
      @createEvent="createEvent"
      :display="modals['create_event']"
    />
    <CreateEmployee
      @toggle="modals['create_employee'] = $event"
      :display="modals['create_employee']"
    />

    <!-- Shift and calendar view -->
    <ScheduleFilters
      @toggle="modals['schedule_view'] = $event"
      :view="modals['schedule_view']"
      @updateFilters="filters = $event"
    />
  </el-row>
</template>

<script>
import dates from "@/mixins/dates";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import CreateShift from "./components/CreateShift";
import CreateEmployee from "./components/CreateEmployee";
import Toolbar from "./components/Toolbar";
import Dropdown from "@/components/Dropdown.vue";
import Popover from "@/components/Popover";
import ScheduleCalendar from "./components/ScheduleCalendar";
import Title from "@/components/Title";
import ScheduleFilters from "./components/ScheduleFilters";
export default {
  name: "Schedule",
  deactivated() {
    this.$destroy();
  },
  data() {
    return {
      self: this,
      loading: false,
      scheduleInterval: null,

      filters: {
        schedule_view: "week"
      },

      modals: {
        create_event: false,
        edit_event: false,
        view_profile: false,
        export_profile: false,
        export_schedule: false,
        create_employee: false,
        schedule_view: false
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
    ...mapActions("Admin", ["getShifts"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    refreshShifts() {
      this.getShifts();
    },

    createEvent(eventData) {
      this.loading = true;
      this.modals.createEvent = false;

      const date = {
        start: new Date(eventData.date[0]).toISOString(),
        end: new Date(eventData.date[1]).toISOString()
      };

      let { start, end } = date;

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
          startDate: start,
          endDate: end,
          type,
          assignedTo
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
      this.modals[command] = true;
    }
  },
  mixins: [dates],

  components: {
    Title,
    ScheduleCalendar,
    CreateShift,
    Dropdown,
    Popover,
    CreateEmployee,
    Toolbar,
    ScheduleFilters
  }
};
</script>
<style lang="scss" scoped>
.schedule_container {
  height: 100%;
  // overflow-y: auto;
}
.schedule_cal_container {
  height: 75%;
}
</style>
