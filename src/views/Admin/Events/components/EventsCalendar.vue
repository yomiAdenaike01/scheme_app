<template>
  <div class="cal_container">
    <div class="bar_incidator">
      <span>
        <h1>
          <strong :style="{ color: `${getDefaultColour}` }"
            >{{ upcomingEventCount }}
          </strong>
        </h1>
        upcoming events.
      </span>
    </div>
    <VueCal
      ref="eventsCalendar"
      v-loading="loading"
      :events="calEvents"
      :on-event-click="viewEvent"
      events-on-month-view="short"
      :cell-click-hold="false"
      :time-from="getCalTimings.from"
      :time-to="getCalTimings.to"
      editable-events
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import moment from "moment";
export default {
  name: "EventsCalendar",
  data() {
    return {
      view: false,
      loading: false,
      event: {},
      format: "YYYY-MM-DD HH:mm"
    };
  },

  computed: {
    ...mapState("Admin", [
      "eventsInformation",
      "teamInformation",
      "eventFilters"
    ]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin", "getDefaultColour"]),
    ...mapGetters("Admin", [
      "getTeamMember",
      "getAllEvents",
      "getGroupName",
      "getEventAssignedTo",
      "getUsersEvents",
      "getCalTimings"
    ]),

    upcomingEventCount() {
      return this.eventsInformation.upcoming.length;
    },

    eventGroup() {
      let eventGroup = [];
      if (this.hasEntries(this.clientInformation)) {
        eventGroup = this.clientInformation.eventGroups;
      }
      return eventGroup;
    },

    returnCalendarOptions() {
      return [
        {
          label: "Days",
          value: "day"
        },
        {
          label: "Weeks",
          value: "week"
        },
        {
          label: "Month",
          value: "month"
        },
        {
          label: "Year",
          value: "year"
        }
      ];
    },

    calEvents() {
      /**
       * title,
       * name,
       * id,
       * class,
       * formatted time
       * approval
       */
      let events = this.eventsInformation.all;
      let filteredEvents = [];
      // Check that the assigned to is a string or array

      for (let i = 0, len = events.length; i < len; i++) {
        let event = events[i];

        let {
          isApproved,
          startDate,
          _id,
          endDate,
          assignedTo,
          type,
          clockedIn
        } = event;
        if (assignedTo.length > 0) {
          assignedTo = this.getEventAssignedTo([...assignedTo]);
        } else {
          assignedTo = [];
        }
        type = this.getGroupName("event", type).name;
        startDate = moment(startDate).format(this.format);
        endDate = moment(endDate).format(this.format);

        let eventClass = type.replace(/\s/g, "_").toLowerCase();

        filteredEvents.push({
          id: _id,
          start: startDate,
          end: endDate,
          content: assignedTo.text,
          class: eventClass,
          isApproved,
          assignedTo: assignedTo.arr,
          assignedToIDs: event.assignedTo,
          type,
          clockedIn
        });
      }

      return filteredEvents;
    },

    returnEventDetails() {
      return this.eventsInformation.find(event => {
        return event.id == this.event_id;
      });
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS", "UPDATE_DIALOG_INDEX"]),

    viewEvent(event) {
      this.UPDATE_DIALOG_INDEX({
        view: true,
        dialog: "viewEvent",
        data: event
      });
    },

    displayCreateNewShift() {
      this.$emit("displayCreateShift", true);
    },

    changeShiftTime(event) {
      const canEdit =
        event.assignedTo == this.userInformation._id || this.getIsAdmin;

      if (canEdit) {
        let confirmResponse = this.confirmShiftChangeTime(event);

        if (confirmResponse) {
          let { startDate, endDate } = event;
          this.loading = true;
          this.updateEvent(event);
        }
      } else {
        this.loading = false;

        this.UPDATE_NOTIFICATIONS({
          title: "Error changing event type",
          message:
            "You cannot edit this event because you are not an admin or this event is not yours.",
          type: "info"
        });

        this.$forceUpdate();
      }
    },

    confirmShiftChangeTime(event) {
      let { type, assignedTo, start, end } = event;

      return this.$confirm(
        `Are you sure you would like to change ${type.toLowerCase()} from ${start} to ${end}`,
        "Confirm",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "info"
        }
      )
        .then(response => {
          return response;
        })
        .catch(error => {
          return error;
        });
    },

    updateEvent({ startDate, endDate, _id }) {
      startDate = startDate.toISOString();
      endDate = endDate.toISOString();

      const payload = {
        id: _id,
        update: {
          startDate,
          endDate
        }
      };

      return this.request({
        url: "events/update",
        method: "POST",
        data: payload
      })
        .then(response => {
          return response;
        })
        .catch(error => {
          this.loading = false;
          return error;
        });
    }
  },
  components: {
    VueCal
  }
};
</script>

<style lang="scss" scoped>
.cal_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  &/deep/ {
    .vuecal__now-line {
      color: $element_colour;
    }

    .vuecal__event {
      background: #ecf5ff;
      border-top: 2px solid $element_colour;
      color: $element_colour;
      font-size: 0.8em;
      padding: 1em;
      text-transform: capitalize;

      &.holiday {
        background: #fef0f0;
        border-top: 2px solid #f56c6c;
        color: #f56c6c;
      }
      &.time_off,
      &.sick_leave {
        background: #fdf6ec;
        border-top: 2px solid #f2c678;
        color: #f2c678;
      }
    }
    .el-icon-circle-close {
      color: red;
    }
    .el-icon-circle-check {
      color: green;
    }
    .vuecal__title-bar {
      background: none;
      margin: 1em 0;
      .vuecal__title {
        button {
          color: #999;
        }
      }
    }
  }
}

.bar_incidator {
  border: 1px solid whitesmoke;
  border-radius: 5px;
  margin-bottom: 40px;
  padding: 20px;
  text-align: center;
}
</style>
