<template>
  <div>
    <vue-cal
      xsmall
      v-loading="loading"
      :events="returnShiftEvents"
      :default-view="ScheduleFilters"
      :on-event-click="ViewEvent"
      events-on-month-view="short"
      editable-events
      @event-duration-change="changeShiftTime"
      :cell-click-hold="false"
    />

    <ViewEvent
      v-if="view"
      :display="view"
      :event="event"
      @toggle="view = $event"
      @loading="loading = $event"
      @refreshShift="$emit('refreshShift', null)"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ViewEvent from "./ViewEvent";
import moment from "moment";
export default {
  name: "Cal",

  data() {
    return {
      view: false,
      loading: false,
      event: {}
    };
  },

  props: {
    ScheduleFilters: {
      type: String
    }
  },

  computed: {
    ...mapState("Admin", ["events", "teamInformation"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getTeamMember", "getAllShifts"]),

    // isMine() {
    //   return this.returnShiftDetails._id == this.userInformation._id
    // },
    eventTypes() {
      let eventTypes = [];
      if (
        this.hasEntries(this.clientInformation) &&
        "eventGroups" in this.clientInformation
      ) {
        eventTypes = this.clientInformation.eventGroups;
      }
      return eventTypes;
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
    returnShiftEvents() {
      /**
       * title,
       * name,
       * id,
       * class,
       * formatted time
       * approval
       */
      let events = this.events.all;
      let len = events.length;
      let format = "YYYY-MM-DD HH:mm";

      // Check that the assigned to is a string or array

      events = events.map(event => {
        let { isApproved, startDate, _id, endDate, assignedTo, type } = event;
        type = type - 1;
        type = this.eventTypes[type].name;
        startDate = moment(startDate).format(format);
        endDate = moment(endDate).format(format);

        let eventClass = type.replace(" ", "_").toLowerCase();
        let text = type;

        text = `${this.teamInformation.map(member => {
          if (member._id == assignedTo) {
            return member.name;
          }
        })} ${type}`;

        return {
          id: _id,
          start: startDate,
          end: endDate,
          content: text,
          class: eventClass,
          isApproved,
          assignedTo,
          type
        };
      });
      return events;
    },

    returnShiftDetails() {
      return this.events.find(event => {
        return event.id == this.event_id;
      });
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    returntype(name, type) {
      return {
        text: `${name}'s ${this.eventTypes[type].name}`,
        type: this.eventTypes[type].name,
        eventClass: this.eventTypes[type].name.trim().toLowerCase()
      };
    },

    ViewEvent(event) {
      this.event = event;
      this.view = true;
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
    VueCal,
    ViewEvent
  }
};
</script>

<style lang="scss">
.vuecal__now-line {
  color: $primary_colour;
}

.vuecal__event {
  font-size: 0.8em;
  &.general_event {
    background: #ecf5ff;
    color: $primary_colour;
    border-top: 2px solid $primary_colour;
  }

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
</style>
