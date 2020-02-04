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
import moment from "moment";
export default {
  name: "Cal",

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

  computed: {
    ...mapState("Admin", ["shifts", "team", "shiftTypes"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getTeamMember", "getAllShifts"]),

    // isMine() {
    //   return this.returnShiftDetails._id == this.userInformation._id
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
      /**
       * title,
       * name,
       * id,
       * class,
       * formatted time
       * approval
       */
      let shifts = this.shifts.all;
      let len = shifts.length;
      let format = "YYYY-MM-DD HH:mm";

      // Check that the assigned to is a string or array

      shifts = shifts.map(shift => {
        let { isApproved, startDate, _id, endDate, assignedTo, type } = shift;
        type = type - 1;
        type = this.shiftTypes[type].name;
        startDate = moment(startDate).format(format);
        endDate = moment(endDate).format(format);

        let shiftClass = type.replace(" ", "_").toLowerCase();
        let text = type;

        if (Array.isArray(assignedTo)) {
          text = `Multiple team member's ${type}`;
        }

        return {
          id: _id,
          start: startDate,
          end: endDate,
          content: text,
          class: shiftClass,
          isApproved,
          assignedTo,
          type
        };
      });
      return shifts;
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

    returntype(name, type) {
      return {
        text: `${name}'s ${this.shiftTypes[type].name}`,
        type: this.shiftTypes[type].name,
        eventClass: this.shiftTypes[type].name.trim().toLowerCase()
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
        shift.assignedTo == this.userInformation._id || this.getIsAdmin;

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
      let { type, assignedTo, start, end } = shift;

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
  &.general_shift {
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
