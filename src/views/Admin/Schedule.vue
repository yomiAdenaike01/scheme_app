<template>
  <el-row v-loading="loading">
    <el-col :span="3">
      <el-menu class="sidebar">
        <el-menu-item v-for="item in filterConfig" :key="item">
          <el-checkbox class="checkbox" v-model="filters[item]">{{ item }}</el-checkbox>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col :span="20">
      <el-row class="m-4" type="flex" justify="space-between">
        <el-col :span="5" type="flex" align="center">
          <el-dropdown trigger="click">
            <span title="view_container">
              <span class="black bold">Schedule:</span>
              <span class="bold el-dropdown-link view_indicator">
                {{
                currentView
                }}
              </span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="view in viewSelectionConfig"
                :key="view.value"
                :command="view"
              >{{ view.name }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="4">
          <el-dropdown @command="displayModals">
            <el-button type="primary" round>Actions</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                command="add_event"
              >{{getIsAdmin ? 'Create Event' : 'Create Request' }}</el-dropdown-item>
              <el-dropdown-item
                command="edit_event"
              >{{getIsAdmin ? 'Update / Remove Event' : 'Update / Remove Request'}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
      <ScheduleTable :tableData="tableData" />
    </el-col>

    <ScheduleFormDialog
      @toggle="modals.createEvent = $event"
      @createEvent="createEvent"
      :display="modals.createEvent"
    />
  </el-row>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import dates from "@/mixins/dates";
import { mapState, mapActions, mapGetters } from "vuex";
import ScheduleFormDialog from "./components/ScheduleFormDialog";
export default {
  name: "Schedule",
  data() {
    return {
      loading: false,

      filters: {
        employee: "",
        abscences: "",
        holidays: "",
        late: ""
      },
      modals: {
        createEvent: false,
        editEvent: false
      },

      tableData: [
        {
          date: "2016-05-03",
          name: "Simon",
          position: "Locumn",
          approved: false
        },
        {
          date: "2016-05-02",
          name: "Yomi",
          position: "Floor Staff",

          approved: true
        },
        {
          date: "2016-05-04",
          name: "Tom",
          position: "Locumn",
          approved: false
        },
        {
          date: "2016-05-01",
          name: "Jumoke",
          position: "Floor Staff",

          approved: true
        }
      ],

      currentView: "",
      dateFormat: "DD MMMM"
    };
  },
  created() {
    this.getTeam();
  },

  computed: {
    ...mapState(["team"]),
    ...mapGetters(["getIsAdmin"]),

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
    ...mapActions(["getTeam", "request"]),
    createEvent(eventData) {
      this.loading = true;
      this.modals.createEvent = false;
      const date = { start: eventData.start, end: eventData.end };
      const startTime = this.format(date.start.time, "HH:mm:ss");
      const endTime = this.format(date.end.time, "HH:mm:ss");
      const startDate = this.format(date.start.date, "MM/DD/YYYY");
      const endDate = this.format(date.end.date, "MM/DD/YYYY");

      const completeStartDate = this.toISO(`${startDate} ${startTime}`);
      const completeEndDate = this.toISO(`${endDate} ${endTime}`);

      const payload = {
        url: "/shifts/create",
        method: "POST",
        data: {
          startDate: completeStartDate,
          endDate: completeEndDate,
          shift_type: eventData.eventType
        }
      };
      if (eventData.assignTo) {
        payload.assigned_to = eventData.assignTo;
      }
      this.request(payload)
        .then(response => {
          const message = this.getIsAdmin
            ? "Event successfully created"
            : "Request successfully created";
          this.$notify({
            title: "Success",
            message: message,
            type: "success"
          });
          this.loading = false;
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: "Error when creating event, please try again later"
          });
          this.loading = false;
        });
    },
    displayModals(command) {
      console.log(command);
      if (command == "add_event") {
        this.modals.createEvent = true;
      } else {
        this.modals.editEvent = true;
      }
    }
  },
  mixins: [dates],

  components: {
    VueCal,
    Title: () => import("@/components/Title"),
    ScheduleTable: () => import("./components/ScheduleTable"),
    ScheduleFormDialog
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
  color: #2f74eb;
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
