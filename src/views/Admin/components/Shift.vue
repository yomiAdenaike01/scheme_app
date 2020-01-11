<template>
  <el-card
    :body-style="{ padding: '0px' }"
    class="mb-3 ml-3 mr-3 shift_container"
  >
    <el-row type="flex">
      <el-col class="shift_details_container unit p-3">
        <h5 class="member_name">{{ shift.shift_type }}</h5>
        <p class="member_name mt-1 mb-1">{{ shift.assigned_to }}</p>
        <span class="grey employee_type">
          <i class="el-icon el-icon-user grey"></i>
          {{ getEmployeeType }}
        </span>
      </el-col>
      <el-col :class="['shift_times unit p-3', shift.class]">
        <div style="display:flex;justify-content:center; align-items:center">
          <span class="date">{{ shift.startDate }}</span>
          <div
            class="ml-3 mr-3"
            style="display:flex; justify-content:center; align-items:center; flex-direction:column"
          >
            <i
              style="font-size:1.3em"
              class="el-icon el-icon-right p-0 m-0 grey"
            ></i>
            <span class="time_diff grey"
              >{{ startAndEndTimeDiff }} {{ startEndTimeDiffType }}</span
            >
          </div>
          <span class="date">{{ shift.endDate }}</span>
        </div>
      </el-col>
      <el-col class="p-3 approval_wrapper unit">
        <el-tag
          class="member_name"
          :type="shift.completed ? 'primary' : 'danger'"
          >{{
            shift.completed ? "Finished/ Ready to delete" : "Incomplete"
          }}</el-tag
        >
      </el-col>
      <el-col class="p-3 approval_wrapper">
        <Dropdown :items="shiftActionItems" @method="handleShiftActions" />
        <!-- <el-tag
          @click="deleteShift"
          class="member_name"
          :type="shift.completed ? 'primary' : 'danger'"
          >{{
            shift.completed ? "Finished/ Ready to delete" : "Incomplete"
          }}</el-tag -->
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import employeeMethods from "@/mixins/employeeMethods";
import dates from "@/mixins/dates";
import Dropdown from "@/components/Dropdown";
export default {
  name: "Shift",
  mixins: [employeeMethods, dates],

  data() {
    return {
      viewDetails: false,
      startEndTimeDiffType: "hours"
    };
  },
  props: {
    shift: Object
  },
  computed: {
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),
    shiftActionItems() {
      let actions = [];
      if (this.shift.assigned_to == this.currentUser._id || this.getIsAdmin) {
        actions.push(
          {
            name: "Delete Shift",
            command: "delete_shift"
          },
          {
            name: "Update Shift",
            command: "update_shift"
          }
        );
      } else {
        actions.push({
          name: "View Shift",
          command: "view_shift"
        });
      }
      return actions;
    },
    approved() {
      let result;
      let approval = this.shift.is_approved;
      if (approval.admin == 0) {
        result = "declined";
      } else if (approval.admin == 0 && approval.user == 0) {
        result = "undecided";
      } else if (approval.admin == 1 && approval.user == 1) {
        result = "accepted";
      }
      return result;
    },
    stepTypeText() {
      let step;
      switch (this.shift.shift_type_num) {
        case 1:
          step = "Shift";
          break;
        case 2:
          step = "Shift";
          break;
        case 3:
          step = "Holiday";
          break;
        case 4:
          step = "Time Off";
          break;
        case 5:
          step = "Sick Leave";
          break;
        default:
          break;
      }
      return step;
    },
    startAndEndTimeDiff() {
      let shift = this.shift;
      let isoEnd = shift.isoEnd;
      let isoStart = shift.isoStart;
      let type = shift.shift_type_num;
      let diff = this.duration(isoEnd, isoStart).as("hours");
      if (diff > 23) {
        this.startEndTimeDiffType = "days";
      } else if (diff > 100) {
        this.startEndTimeDiffType = "weeks";
      }
      diff = this.duration(isoEnd, isoStart).as(this.startEndTimeDiffType);

      return Math.floor(diff);
    },
    getEmployeeType() {
      return this.convertEmployeeType(this.shift.user);
    }
  },
  methods: {
    ...mapActions(["request"]),
    confirmDeleteShift() {
      return this.$confirm("Are you sure you want to delete this shift ? ");
    },
    handleShiftActions(command) {
      switch (command) {
        case "delete_shift": {
          this.deleteShift();
          break;
        }

        case "view_shift": {
          this.$router.push({ name: "schedule" });
          break;
        }
        case "update_shift": {
          this.$router.push({ name: "schedule" });
          break;
        }

        default:
          break;
      }
    },
    async deleteShift() {
      try {
        let confirmShift = await this.confirmDeleteShift();
        let deleteRequest = await this.request({
          method: "DELETE",
          url: "shifts/delete",
          data: { id: this.shift._id }
        });
        await Promise.all([confirmShift, deleteRequest]);
      } catch (error) {
        return error;
      }
    }
  },
  components: {
    Dropdown
  }
};
</script>

<style lang="scss" scoped>
.shift_container {
  cursor: pointer;
  font-size: 0.9em;
}

// .normal_staff {
//   background: #ecf5ff;
//   color: $primary_colour;
//   // border-top: 2px solid $primary_colour;
// }
// .locumn {
//   background: #f0f9eb;
//   color: #67c23a;
//   // border-top: 2px solid #67c23a;
// }
// .holiday {
//   background: #fef0f0;
//   color: #f56c6c;
//   // border-top: 2px solid #f56c6c;
// }
// .time_off {
//   background: #fdf6ec;
//   color: #f2c678;
//   // border-top: 2px solid #f2c678;
// }
.shift_times {
  display: flex;
  justify-content: center;
  align-items: center;
}

.unit {
  border-right: 1px solid #e6e6e6;
}
.shift_details_container {
  width: 20%;
}
.employee_type {
  text-transform: uppercase;
  font-size: 0.8em;
}
.approval_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
</style>
