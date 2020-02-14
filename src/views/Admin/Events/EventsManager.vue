<template>
  <el-row
    class="schedule_container w-100"
    type="flex"
    v-loading="loading"
    element-loading-text="Loading team members and events please wait..."
  >
    <!-- Shift and calendar view -->
    <EventFilters />

    <el-col>
      <Toolbar @modalChanges="self['modals'][$event] = true" class="m-3" />

      <Cal
        @refreshShift="getEvents"
        @displayCreateEvent="modals.createEvent = $event"
        class="schedule_cal_container"
      />

      <EventMangerDialog
        @toggle="modals.createEvent = $event"
        @createEvent="createEvent"
        :display="modals.createEvent"
      />
    </el-col>
  </el-row>
</template>

<script>
import dates from "@/mixins/dates";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import EventMangerDialog from "./components/EventMangerDialog";
import Toolbar from "./components/Toolbar";
import Dropdown from "@/components/Dropdown.vue";
import Popover from "@/components/Popover";
import Cal from "./components/Cal";
import Title from "@/components/Title";
import EventFilters from "./components/EventFilters";
export default {
  name: "EventsManager",
  activated() {
    this.loading = true;
    Promise.all([this.getEvents(), this.getTeam()]).then(response => {
      this.loading = false;
    });
    if ("gcalToken" in this.userInformation) {
      this.request({
        method: "GET",
        url: "users/gcal"
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.error(err);
        });
    }
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
        createEvent: false,
        view_profile: false
      },

      currentView: "",
      dateFormat: "DD MMMM"
    };
  },

  computed: {
    ...mapState("Admin", ["teamInformation"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    filteredTeam() {
      return this.teamInformation.filter(x => {
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
    ...mapActions("Admin", ["getEvents", "getTeam"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    refreshShifts() {
      this.getEvents();
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
        url: "/events/create",
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
          this.getEvents();
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
    Cal,
    EventMangerDialog,
    Dropdown,
    Popover,
    Toolbar,
    EventFilters
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
