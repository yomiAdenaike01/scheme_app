<template>
  <el-dialog :visible.sync="computeDisplay">
    <Title title="View Shift" subtitle="Click on more information to display details">
      <MoreInformation index="admin" instruction="view_shift" />
    </Title>
    <el-row type="flex" v-loading="loading">
      <!-- FIRST COLUMN -->

      <el-col class="view_shift_col">
        <!-- Assigned to (tags)-->
        <div class="view_shift_dialog_item">
          <h4>Assigned to</h4>
          <el-tag
            class="m-1"
            type="info"
            :closable="computeRemoveShift['canDelete']"
            v-for="(teamMember,index) in renderAssignedTo"
            :key="index"
            @close="removeTeamMemberFromShift(teamMember)"
            :id="teamMember['id']"
          >{{teamMember['name']}}</el-tag>
        </div>
        <!-- Shift type -->

        <el-col class="view_shift_dialog_item">
          <h4>Shift / Event type</h4>

          <!-- Conditional drop down to change the shift type (if yours) -->
          <Dropdown
            :icon="false"
            v-if="computeRemoveShift['canDelete']"
            :items="returnShiftTypes(shift.shift_type, 'command')"
            @method="handleChangeShiftType"
            position="right"
          >
            <el-button
              round
              size="small"
              :type="renderButtonTypes['shiftType']['type']"
            >{{renderButtonTypes['shiftType']['text']}}</el-button>
          </Dropdown>

          <el-button
            round
            v-else
            size="small"
            :type="renderButtonTypes['shiftType']['type']"
          >{{renderButtonTypes['shiftType']['text']}}</el-button>
        </el-col>

        <!-- Approval -->
        <el-col class="view_shift_dialog_item">
          <h4>Shift / Event approval</h4>
          <el-button
            circle
            :icon="renderButtonTypes['approval']['icon']"
            :type="renderButtonTypes['approval']['type']"
          ></el-button>
        </el-col>
      </el-col>

      <!-- SECOND COLUMN -->
      <el-col class="view_shift_col">
        <!-- Date content-->

        <div class="view_shift_dialog_item">
          <h4>Start date</h4>
          <p class="mb-2">{{renderDateContent.start}}</p>
        </div>
        <div class="view_shift_dialog_item">
          <h4>End date</h4>
          <p>{{renderDateContent.end}}</p>
        </div>
      </el-col>
    </el-row>
    <div class="view_shift_dialog_item no_border flex_center">
      <!-- Edit shift button -->
      <el-button
        class="flex-1"
        round
        type="primary"
        v-if="computeRemoveShift['canDrop'] || computeRemoveShift['canDelete']"
      >Edit shift</el-button>
      <!-- Remove shift or delete shift button -->
      <el-button
        type="danger"
        class="flex-1"
        round
        @click="renderDeleteButtonContent['method']"
      >{{renderDeleteButtonContent['text']}}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";
import MoreInformation from "@/components/MoreInformation";
import moment from "moment";
import Dropdown from "@/components/Dropdown";
import shiftTypes from "@/mixins/shiftTypes";
export default {
  name: "ViewShift",
  mixins: [shiftTypes],
  data() {
    return {
      loading: false
    };
  },
  props: {
    shift: {
      type: Object,
      default: () => {
        return {};
      }
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState("Admin", ["team", "shiftTypes"]),
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),
    returnShifTypes() {
      let { shift_type } = this.shift;
      return this.getShiftType(shift_type, "command");
    },

    computeDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    },
    renderButtonTypes() {
      let { shift_type } = this.shift;
      let isApproved = this.returnIsApproved;
      let buttonContent = {
        shiftType: {
          type: "",
          text: ""
        },
        approval: {
          type: "danger",
          icon: "el-icon-close"
        }
      };

      if (isApproved) {
        buttonContent["approval"] = {
          type: "success",
          icon: "el-icon-check"
        };
      }

      switch (shift_type) {
        case 4: {
          buttonContent["shiftType"] = {
            type: "info",
            text: "Time Off"
          };
          break;
        }

        case 1: {
          buttonContent["shiftType"] = {
            type: "primary",
            text: "Normal Shift"
          };
          break;
        }

        case 3: {
          buttonContent["shiftType"] = {
            type: "warning",
            text: "Holiday"
          };
          break;
        }

        case 5: {
          buttonContent["shiftType"] = {
            type: "success",
            text: "Sick Leave"
          };
          break;
        }

        case 2: {
          buttonContent["shiftType"] = {
            type: "plain",
            text: "Locumn"
          };
        }

        default: {
          break;
        }
      }
      return buttonContent;
    },
    returnIsApproved() {
      let { admin } = this.shift["is_approved"];
      let approved = false;
      if (admin == 1) {
        approved = true;
      }
      return approved;
    },

    renderDateContent() {
      let { startDate, endDate } = this.shift;
      const format = "DD/MM/YYYY HH:mm";
      startDate = moment(startDate).format(format);
      endDate = moment(endDate).format(format);
      return {
        start: startDate,
        end: endDate
      };
    },

    // Render the content of the button when a user can remove or drop of a shift

    renderDeleteButtonContent() {
      let { canDelete, canDrop } = this.computeRemoveShift;
      let buttonContent = {
        text: "",
        method: ""
      };
      if (canDelete) {
        buttonContent.method = () => {
          this.deleteShift(this.returnShiftID);
        };
        buttonContent.text = "Delete shift";
      }
      return buttonContent;
    },

    computeRemoveShift() {
      let shiftRemoval = {
        canDelete: false,
        canDrop: false
      };

      let { name } = this.currentUser;
      let { is_pickup } = this.shift;
      let foundUser;

      name = name.trim().toLowerCase();

      let { assigned_to } = this.shift;

      if (Array.isArray(this.shift)) {
        foundUser = assigned_to.find((assignee, index) => {
          return assignee._id == this.team[index]._id;
        });
      }

      if (foundUser) {
        foundUser["name"] = foundUser["name"].toLowerCase();
      }

      if (this.getIsAdmin) {
        shiftRemoval["canDelete"] = true;
      } else if (foundUser.name == name) {
        shiftRemoval["canDelete"] = true;

        if (is_pickup) {
          shiftRemoval["canDrop"] = true;
        }
      }
      return shiftRemoval;
    },
    renderAssignedTo() {
      let { assigned_to } = this.shift;
      let team = this.team;
      let mappedTeamMemberNames;

      if (Array.isArray(assigned_to)) {
        // Loop assigned to and replace them with names

        const len = assigned_to.length;
        mappedTeamMemberNames = [];
        // Return the team member names if its an array

        for (let i = 0; i < len; i++) {
          let assignedTeamMember = assigned_to[i];
          const teamLen = team.length;

          for (let j = 0; j < teamLen; j++) {
            let teamMember = team[j];
            let teamMemberID = teamMember._id;

            if (
              assignedTeamMember &&
              teamMemberID &&
              assignedTeamMember == teamMemberID
            ) {
              mappedTeamMemberNames.push({
                name: teamMember["name"],
                id: teamMemberID
              });
            }
          }
        }
      } else {
        // Find the id within the team

        let { assigned_to } = this.shift;
        mappedTeamMemberNames = this.team.find(member => {
          return member._id == assigned_to;
        });

        if (mappedTeamMemberNames) {
          mappedTeamMemberNames = mappedTeamMemberNames["name"];
        } else {
          mappedTeamMemberNames = {
            name: "John Doe"
          };
        }
      }
      return mappedTeamMemberNames;
    },

    returnShiftID() {
      return this.shift.id;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["deleteShift", "updateShift", "getShiftType"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),

    closeDialog() {
      this.$nextTick(() => {
        this.loading = false;
        this.$emit("toggle", false);
        this.$emit("refreshShift", null);
      });
    },

    // Just update the shift without their name
    async removeTeamMemberFromShift({ name, id }) {
      // Confirm that this is what they want
      try {
        let response = await this.confirmUserRemovalFromShift(name);

        let shiftTeamMembers = [];

        const len = this.renderAssignedTo.length;

        for (let i = 0; i < len; i++) {
          let teamMemberAssignedToShift = this.renderAssignedTo[i];

          teamMemberAssignedToShift = teamMemberAssignedToShift["id"];

          if (teamMemberAssignedToShift == id) {
            continue;
          }

          shiftTeamMembers.push(teamMemberAssignedToShift);
        }

        if (response == "confirm") {
          this.loading = true;
          await this.updateShift({
            update: { assigned_to: shiftTeamMembers },
            id: this.returnShiftID
          });

          this.closeDialog();
        }
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    // REFACTOR TO ONLY USE ONE
    async confirmRemoveWholeShift() {
      return await this.$confirm(
        "Are you sure you want to delete the shift/event ?",
        "Delete Confirmation"
      );
    },
    async confirmUserRemovalFromShift(name) {
      return await this.$confirm(
        `Are you sure that you want to remove ${name} from this event ?`,
        "Confirm Update"
      );
    },

    // View the user that the shift is assigned to
    toggleViewTeamMember() {
      this.UPDATE_VIEW_TEAM_MEMBER({ view: true, id: this.shift.assigned_to });
    },
    async handleChangeShiftType(shiftType) {
      this.loading = true;
      await this.updateShift({
        id: this.returnShiftID,
        update: { shift_type: shiftType }
      });
      this.loading = false;
      this.closeDialog();
    }
  },

  components: {
    Title,
    MoreInformation,
    Dropdown
  }
};
</script>
<style lang="scss" scoped>
.view_shift_dialog_item {
  margin: 1em;
  border: 1.2px solid whitesmoke;
  padding: 1em;
  border-radius: 10px;
  max-width: 100%;
  &.no_border {
    border: none;
  }
}
h4 {
  margin-bottom: 10px;
}
.view_shift_col {
  margin: 1em;
}
</style>