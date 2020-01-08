<template>
  <el-dialog :visible.sync="toggleView">{{teamMember}}</el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "TeamMember",
  data() {
    return {
      documentation: []
    };
  },

  computed: {
    ...mapState("Admin", ["shifts", "team", "requests", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getTeamMember"]),
    teamMember() {
      return this.viewTeamMember.id;
    },
    toggleView: {
      get() {
        return this.viewTeamMember.view;
      },
      set(val) {
        this.UPDATE_VIEW_TEAM_MEMBER(val);
      }
    },
    returnAllUserInfo() {
      return this.getTeamMember(teamMember, "_id");
    },
    getTeamMemberShifts() {
      return this.shifts.filter(shift => {
        return shift.assigned_to == this.teamMember;
      });
    },
    getSimilarTeamMembers() {
      return this.team.filter(member => {
        return member.employee_type == this.returnAllUserInfo.employee_type;
      });
    },
    dropdownItems() {}
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),

    getDocumentation() {
      this.request({
        method: "GET",
        params: { id: this.teamMember },
        url: "users/documentation"
      })
        .then(response => {
          this.documentation = response;
        })
        .catch(error => {
          return error;
        });
    }
  }
};
</script>

<style>
</style>