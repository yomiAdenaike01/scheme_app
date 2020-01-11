<template>
  <div>
    <!-- <el-select v-model="default_view">
      <el-option
        v-for="(option, index) in returnCalendarOptions"
        :key="index"
        :label="option.label"
        :value="option.value"
        >{{ option.label }}</el-option
      >
    </el-select> -->
    <vue-cal
      v-loading="loading"
      :events="returnShiftEvents"
      :default-view="default_view"
      hide-view-selector
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
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import ViewShift from "./dialogs/ViewShift";
import dates from "@/mixins/dates";
export default {
  name: "ScheduleCalendar",

  data() {
    return {
      view: false,
      loading: false,
      default_view: "week",
      shift: {}
    };
  },
  created() {
    this.getShifts();
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
      for (let i = 0; i < len; i++) {
        let shift = shifts[i];

        let index = this.team.findIndex(x => {
          return shift.assigned_to == x._id;
        });
        let name;
        if (this.team[index]) {
          name = this.team[index].name;
        } else if (this.currentUser._id == shift.assigned_to) {
          name = this.currentUser.name;
        } else {
          name = "John Doe";
        }

        let shiftContent = this.returnShiftType(name, shift.shift_type);

        let shiftEvent = {
          id: shift._id,
          start: this.format(shift.startDate, format),
          end: this.format(shift.endDate, format),
          content: shiftContent.text,
          class: shiftContent.eventClass,
          assigned_to: shiftContent.name || shift.assigned_to,
          type: shiftContent.type,
          is_pickup: shift.is_pickup,
          shift_type: shift.shift_type,
          is_approved: shift.is_approved
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
    ...mapActions("Admin", ["getShifts"]),
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
      // Check are you admin or is this shift yours
      let canEdit =
        shift.assigned_to == this.currentUser._id || this.getIsAdmin;
      if (canEdit) {
        let teamMember = this.getTeamMember(shift.assigned_to, "_id").name;
        this.$confirm(
          `Are you sure you would like to change ${teamMember}'s ${shift.type.toLowerCase()} from ${
            shift.start
          } to ${shift.end}`,
          "Confirm",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "info"
          }
        ).then(response => {
          this.loading = true;
          const payload = {
            id: shift.id,
            update: {
              startDate: shift.startDate.toISOString(),
              endDate: shift.endDate.toISOString()
            }
          };

          this.request({
            url: "/shifts/update",
            method: "POST",
            data: payload
          })
            .then(response => {
              this.loading = false;
              let index = this.shifts.findIndex(shift => {
                return shift._id == response._id;
              });
              console.log(index);
              // Replace the shift that is in the same spot with updates
              console.log(response);
            })
            .catch(error => {
              this.loading = false;
              console.log(error);
            });
        });
      } else {
        this.$notify({
          title: "Error",
          type: "error",
          message:
            "You cannot edit this shift because you are not an admin or this shift is not yours."
        });
        this.$forceUpdate();
      }
      console.log(shift);
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
  font-size: 1.1em;
  background: none;
  font-weight: bold;
  .vuecal__title {
    button {
      color: #999;
    }
  }
}
</style>
