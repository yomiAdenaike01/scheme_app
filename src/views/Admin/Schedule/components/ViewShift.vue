<template>
  <el-dialog :visible.sync="display" v-loading="loading">
    <Title title="Shift View" subtitle="View the details of the shift here" />
    {{shift}}
    <!-- Remove shift or delete shift button -->
    <el-button
      type="danger"
      size="small"
      round
      @click="renderDeleteButtonContent['method']"
    >{{renderDeleteButtonContent['text']}}</el-button>
    <!-- Shift type button -->
    <el-button
      round
      :disabled="true"
      size="small"
      :type="renderShiftTypeButton['type']"
    >{{renderShiftTypeButton['text']}}</el-button>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from "vuex";
import Title from "@/components/Title";
import moment from "moment";
export default {
  name: "ViewShift",
  data() {
    return {
      loading: false
    };
  },
  props: {
    shift: Object,
    display: Boolean
  },
  computed: {
    ...mapState("Admin", ["team"]),
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),

    renderIsApproved() {
      let { is_approved } = this.shift;
      let { admin } = is_approved;
      let approved;
      if (admin) {
        approved = true;
      } else {
        approved = false;
      }

      return approved;
    },

    renderShiftTypeButton() {
      let { shift_type } = this.shift;
      let buttonContent = {
        type: "",
        text: ""
      };

      switch (shift_type) {
        case 4: {
          buttonContent = {
            type: "info",
            text: "Time Off"
          };
          break;
        }

        case 1: {
          buttonContent = {
            type: "primary",
            text: "Normal Shift"
          };
          break;
        }

        case 3: {
          buttonContent = {
            type: "warning",
            text: "Holiday"
          };
          break;
        }

        case 5: {
          buttonContent = {
            type: "success",
            text: "Sick Leave"
          };
          break;
        }

        case 2: {
          buttonContent = {
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
    renderDeleteButtonContent() {
      let { canDelete, canDrop } = this.computeRemoveShift;
      let buttonContent = {
        text: "",
        method: ""
      };
      if (canDelete) {
        buttonContent.method = this.removeShift;
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
    renderShiftMethods() {
      let { assigned_to } = this.shift;
      let team = this.team;
      return team.filter((member, index) => {
        return member._id == assigned_to[index] ? member.name : member._id;
      });
    },
    returnShiftID() {
      return this.shift._id;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),

    removeShift() {
      this.request({
        method: "DELETE",
        url: "shifts/delete",
        data: returnShiftID
      })
        .then(response => {
          return response;
        })
        .catch(error => {
          return error;
        });
    },
    // View the user that the shift is assigned to
    toggleViewTeamMember() {
      this.UPDATE_VIEW_TEAM_MEMBER({ view: true, id: this.shift.assigned_to });
    }
  },
  components: {
    Title
  }
};
</script>
