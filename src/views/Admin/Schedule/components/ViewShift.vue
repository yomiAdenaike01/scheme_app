<template>
  <el-dialog :visible.sync="computeDisplay">
    <div v-loading="loading">
      <Title title="Shift View" subtitle="View the details of the shift here" />

      <!-- Assigned to -->
      <el-tag
        type="info"
        closable
        v-for="(teamMember,index) in renderAssignedTo"
        :key="index"
        @close="removeTeamMemberFromShift(teamMember)"
        :id="teamMember['id']"
      >{{teamMember['name']}}</el-tag>

      <el-col>
        <!-- Shift type button -->
        <el-button
          round
          :disabled="true"
          size="small"
          :type="renderButtonTypes['shiftType']['type']"
        >{{renderButtonTypes['shiftType']['text']}}</el-button>
      </el-col>
      <el-col>
        <el-button
          circle
          size="small"
          :icon="renderButtonTypes['approval']['icon']"
          :type="renderButtonTypes['approval']['type']"
        ></el-button>
      </el-col>

      <!-- Date content-->
      <h4>{{renderDateContent.start}}</h4>
      <h4>{{renderDateContent.end}}</h4>

      <el-row type="flex" justify="space-between">
        <el-col>
          <!-- Edit shift button -->
          <el-button
            round
            size="small"
            type="primary"
            v-if="computeRemoveShift['canDrop'] || computeRemoveShift['canDelete']"
          >Edit Shift</el-button>
        </el-col>

        <el-col>
          <!-- Remove shift or delete shift button -->
          <el-button
            type="danger"
            size="small"
            round
            @click="renderDeleteButtonContent['method']"
          >{{renderDeleteButtonContent['text']}}</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";
import MoreInformation from "@/components/MoreInformation";
import moment from "moment";
export default {
  name: "ViewShift",
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
    ...mapState("Admin", ["team"]),
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),
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
      const format = "DD/MM/YYYY h:m";
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
        buttonContent.text = "Delete Shift";
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

      name = name.trim().toLowerCase();

      let { assigned_to } = this.shift;

      if (Array.isArray(this.shift)) {
        var foundUser = assigned_to.find((assignee, index) => {
          return assignee._id == this.team[index]._id;
        });
      }

      if (foundUser) {
        foundUser.name = foundUser.name.toLowerCase();
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
      return this.shift._id;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["deleteShift", "updateShift"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),

    closeDialog() {
      this.loading = false;
      this.$emit("toggle", false);
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

          teamMemberAssignedToShift = {
            id: teamMemberAssignedToShift["id"]
          };

          if (teamMemberAssignedToShift["id"] == id) {
            continue;
          }

          shiftTeamMembers.push(teamMemberAssignedToShift);
        }
        console.log(response);
        if (response == "confirm") {
          this.loading = true;

          await this.updateShift({
            assigned_to: shiftTeamMembers,
            id: this.returnShiftID
          });

          this.closeDialog();
        }
      } catch (error) {
        this.loading = false;
        return error;
      }
    },
    confirmUserRemovalFromShift(name) {
      return new Promise((resolve, reject) => {
        this.$confirm(
          `Are you sure that you want to remove ${name} from this event ?`,
          "Confirm Update"
        )
          .then(response => {
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // View the user that the shift is assigned to
    toggleViewTeamMember() {
      this.UPDATE_VIEW_TEAM_MEMBER({ view: true, id: this.shift.assigned_to });
    }
  },
  components: {
    Title,
    MoreInformation
  }
};
</script>
