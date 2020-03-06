<template>
  <div class="cal_container">
    <div class="bar_incidator">
      {{
        !hasEvents.value
          ? "You have no scheduled events."
          : `You have ${hasEvents.count} events scheduled.`
      }}
    </div>
    <VueCal
      v-loading="loading"
      :events="allEvents"
      :on-event-click="viewEvent"
      events-on-month-view="short"
      :cell-click-hold="false"
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
      format: "YYYY-MM-DD HH:mm",
      gcalEvents: []
    };
  },

  computed: {
    ...mapState("Admin", [
      "eventsInformation",
      "teamInformation",
      "eventFilters"
    ]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", [
      "getTeamMember",
      "getAllEvents",
      "getGroupName",
      "getEventAssignedTo",
      "getUsersEvents"
    ]),

    hasEvents() {
      let userEvents = this.getUsersEvents(this.userInformation._id);
      return {
        value: this.hasEntries(userEvents),
        count: userEvents.length
      };
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
    allEvents() {
      return this.gcalEventsFormatted.concat(this.returnEvents);
    },
    gcalEventsFormatted() {
      if (this.hasEntries(this.gcalEvents)) {
        let gcalEvents = [...this.gcalEvents];
        return gcalEvents.map(event => {
          let {
            summary,
            start,
            end,
            htmlLink,
            creator,
            organizer,
            status
          } = event;
          start = start.date;
          end = end.date;
          start = moment(start).format(this.format);

          end = moment(end).format(this.format);

          return {
            start: start,
            end: end,
            content: summary,
            class: "gcal"
          };
        });
      } else {
        return [];
      }
    },
    returnEvents() {
      let { event_group, user_group } = this.eventFilters;
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

        if (!event == event_group) {
          continue;
        }

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
          assignedToRaw: event.assignedTo,
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

    displayCreateNewShift(startTime) {
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
  flex: 1;
  height: 70%;

  &/deep/ {
    .vuecal__now-line {
      color: $element_colour;
    }

    .vuecal__event {
      font-size: 0.8em;

      background: #ecf5ff;
      color: $element_colour;
      border-top: 2px solid $element_colour;

      &.holiday {
        background: #fef0f0;
        color: #f56c6c;
        border-top: 2px solid #f56c6c;
      }
      &.time_off,
      &.sick_leave {
        background: #fdf6ec;
        color: #f2c678;
        border-top: 2px solid #f2c678;
      }
      padding: 1em;
      text-transform: capitalize;
    }
    .el-icon-circle-close {
      color: red;
    }
    .el-icon-circle-check {
      color: green;
    }
    .vuecal__title-bar {
      margin: 1em 0;
      background: none;
      .vuecal__title {
        button {
          color: #999;
        }
      }
    }
  }
}
.bar_incidator {
  border-radius: 5px;
  text-align: center;
  padding: 20px;
  margin-bottom: 40px;
  border: 1px solid whitesmoke;
}
</style>
