<template>
  <div>
    <vue-cal
      xsmall
      v-loading="loading"
      :events="returnShiftEvents"
      :default-view="ScheduleFilters"
      :on-event-click="viewShift"
      editable-events
      @event-duration-change="changeShiftTime"
      :cell-click-hold="false"
    />

    <ViewShift
      v-if="view"
      :display="view"
      :shift="shift"
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
import ViewShift from "./ViewShift";
import dates from "@/mixins/dates";

export default {
  name: "ScheduleCalendar",

  data() {
    return {
      view: false,
      loading: false,
      shift: {}
    };
  },

  props: {
    ScheduleFilters: {
      type: String
    }
  },

  mixins: [dates],

  computed: {
    ...mapState("Admin", ["shifts", "team"]),
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getTeamMember"]),

    // isMine() {
    //   return this.returnShiftDetails._id == this.currentUser._id
    // },

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
      let shifts = this.shifts;
      let len = shifts.length;
      let format = "YYYY-MM-DD HH:mm";
      let shiftEvents = [];

      // Check that the assigned to is a string or array

      for (let i = 0; i < len; i++) {
        let shift = shifts[i];
        let name;
        let assignedToArrayCondition = Array.isArray(shift.assigned_to);

        if (!assignedToArrayCondition) {
          let index = this.team.findIndex(x => {
            return assigned_to == x._id;
          });
          if (this.team[index]) {
            name = this.team[index].name;
          } else if (this.currentUser._id == shift.assigned_to) {
            name = this.currentUser.name;
          } else {
            name = "Unassigned user to shift";
          }
        } else {
          name = "Multiple Users";
        }
        let {
          _id,
          is_pickup,
          shift_type,
          is_approved,
          assigned_to,
          startDate,
          endDate
        } = shift;

        let shiftContent = this.returnShiftType(name, shift_type);
        let { text, eventClass, type } = shiftContent;

        let shiftEvent = {
          id: _id,
          start: this.format(startDate, format),
          end: this.format(endDate, format),
          content: text,
          class: eventClass,
          assigned_to,
          type,
          is_pickup,
          shift_type,
          is_approved
        };
        shiftEvents.push(shiftEvent);
      }
      return shiftEvents;
    },

    returnShiftDetails() {
      return this.shifts.find(shift => {
        return shift.id == this.shift_id;
      });
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    returnShiftType(name, type) {
      let shiftTitle, shiftClass;
      switch (type) {
        case 1: {
          shiftClass = "normal_staff";
          shiftTitle = "Regular shift";
          break;
        }
        case 2: {
          shiftClass = "locumn";
          shiftTitle = "Locumn shift";

          break;
        }
        case 3: {
          shiftClass = "holiday";
          shiftTitle = "Holiday";

          break;
        }
        case 4: {
          shiftClass = "time_off";
          shiftTitle = "Time off";

          break;
        }
        case 5: {
          shiftClass = "sick_leave";
          shiftTitle = "Sick leave";

          break;
        }
        default:
          break;
      }
      return {
        text: `${name}'s ${shiftTitle}`,
        type: shiftTitle,
        eventClass: shiftClass
      };
    },

    viewShift(shift) {
      this.shift = shift;
      this.view = true;
    },

    displayCreateNewShift(startTime) {
      this.$emit("displayCreateShift", true);
    },

    changeShiftTime(shift) {
      const canEdit =
        shift.assigned_to == this.currentUser._id || this.getIsAdmin;

      if (canEdit) {
        let confirmResponse = this.confirmShiftChangeTime(shift);

        if (confirmResponse) {
          let { startDate, endDate } = shift;
          this.loading = true;
          this.updateShift(shift);
        }
      } else {
        this.loading = false;

        this.UPDATE_NOTIFICATIONS({
          title: "Error changing shift type",
          message:
            "You cannot edit this shift because you are not an admin or this shift is not yours.",
          type: "info"
        });

        this.$forceUpdate();
      }
    },

    confirmShiftChangeTime(shift) {
      let { type, assigned_to, start, end } = shift;

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

    updateShift({ startDate, endDate, _id }) {
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
        url: "/shifts/update",
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
    ViewShift
  }
};
</script>

<style lang="scss">
.vuecal__now-line {
  color: $primary_colour;
}

.vuecal__event {
  font-size: 0.8em;
  &.normal_staff {
    background: #ecf5ff;
    color: $primary_colour;
    border-top: 2px solid $primary_colour;
  }
  &.locumn {
    background: #f0f9eb;
    color: #67c23a;
    border-top: 2px solid #67c23a;
  }
  &.holiday {
    background: #fef0f0;
    color: #f56c6c;
    border-top: 2px solid #f56c6c;
  }
  &.time_off {
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
