]<template>
  <div
    class="mb-3 shift_container rounded shadow"
    :class="{ myShift: isShiftMine }"
  >
    <el-row type="flex">
      <el-col class="shift_details_container details_unit p-2">
        <h5 class="member_name">{{ getShiftType }}</h5>
        <p class="member_name">{{ assignedToText }}</p>
        <el-tag
          class="mr-1"
          effect="dark"
          size="small"
          v-if="approval.boolean"
          :value="approval.text"
          type="success"
          >{{ approval.text }}</el-tag
        >
        <el-tag v-else effect="dark" size="small" type="danger"
          >Not approved</el-tag
        >

        <el-tag effect="dark" size="small" class="capitalize" type="primary">{{
          shift.timeTag
        }}</el-tag>
      </el-col>

      <el-col :class="['shift_times flex details_unit', shift.class]">
        <div class="flex_center">
          <span class="date">{{ formattedDates.start }}</span>
          <div class="flex_center columns">
            <i
              style="font-size:1.3em"
              class="el-icon el-icon-right p-0 m-0 grey"
            ></i>
            <span class="time_diff grey"
              >{{ startAndEndTimeDiff }} {{ startEndTimeDiffType }}</span
            >
          </div>
          <span class="date">{{ formattedDates.end }}</span>
        </div>
      </el-col>

      <el-col class="flex_center shift_controls_wrapper">
        <Dropdown :items="shiftActionItems" @method="handleShiftActions" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import employeeMethods from "@/mixins/employeeMethods";
import dates from "@/mixins/dates";
import Dropdown from "@/components/Dropdown";
import ViewShift from "../../Schedule/components/ViewShift";
import moment from "moment";
export default {
  name: "Shift",
  mixins: [employeeMethods, dates],

  data() {
    return {
      viewDetails: false,
      startEndTimeDiffType: "hours",
      displayViewShift: false
    };
  },
  props: {
    shift: Object
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapState("Admin", ["employeeTypes", "shiftTypes", "team"]),
    isShiftMine() {
      return (
        this.shift.assignedTo == this.userInformation._id || this.getIsAdmin
      );
    },
    shiftActionItems() {
      let actions = [];
      if (
        this.shift.assignedTo == this.userInformation._id ||
        this.getIsAdmin
      ) {
        actions.push(
          {
            name: "Update Shift",
            command: "update_shift"
          },
          {
            name: "Delete Shift",
            command: "delete_shift"
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
    approval() {
      let approved = this.shift.isApproved.admin == 1;
      return {
        boolean: approved,
        text: approved ? "Approved" : "Not Approved"
      };
    },
    shiftTypeText() {
      let { type } = this.shift;
      return this.shiftTypes[type - 1].name;
    },
    assignedToText() {
      let { assignedTo } = this.shift;
      let assignedToText;
      if (Array.isArray(assignedTo) && assignedTo.length > 1) {
        assignedToText = "Multiple Users";
      } else {
        let foundTeamMember = this.team.find(member => {
          return member._id == assignedTo[0];
        });
        if (foundTeamMember && foundTeamMember.hasOwnProperty("name")) {
          assignedToText = foundTeamMember.name;
        } else {
          assignedToText = "No team member found";
        }
      }
      return assignedToText;
    },

    formattedDates() {
      const format = "ddd-MM HH:mm";
      let { startDate, endDate } = this.shift;
      return {
        start: moment(startDate).format(format),
        end: moment(endDate).format(format)
      };
    },

    startAndEndTimeDiff() {
      let { startDate, endDate, type } = this.shift;

      let diff = this.duration(endDate, startDate).as("hours");
      if (diff > 23) {
        this.startEndTimeDiffType = "days";
      } else if (diff > 100) {
        this.startEndTimeDiffType = "weeks";
      }
      diff = this.duration(endDate, startDate).as(this.startEndTimeDiffType);

      return Math.floor(diff);
    },
    getShiftType() {
      let type = this.shift.type - 1;
      return this.shiftTypes[type].name;
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
          this.displayViewShift = true;
          break;
        }
        case "update_shift": {
          this.displayViewShift = true;
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
    Dropdown,
    ViewShift
  }
};
</script>

<style lang="scss" scoped>
.shift_container {
  border-radius: 10px;
  line-height: 2.1em;
  font-weight: 300;
  font-size: 0.9em;
  cursor: pointer;
  opacity: 0.5;
  &.myShift {
    opacity: 1;
  }
}

.shift_times {
  display: flex;
  justify-content: center;
  align-items: center;
}
.shift_details_container {
  width: 30%;
}

.details_unit {
  border-right: 1px solid #e6e6e6;
  padding: 0 10px;
}

.approval_wrapper {
  text-transform: uppercase;
  font-size: 0.8em;
}
.shift_controls_wrapper {
  width: 10%;
}
.date {
  margin: 0 40px;
}
.approved {
  color: green;
}
</style>
