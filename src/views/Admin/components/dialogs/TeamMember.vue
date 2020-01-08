<template>
  <el-dialog :visible.sync="toggleView">
    <el-row type="flex">
      <el-col>
        <el-tabs tab-position="left">
          <el-tab-pane
            :key="index"
            v-for="(tab,index) in tabItems"
            :label="tab.label"
          >{{self[tab.content]}}</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "TeamMember",
  data() {
    return {
      documentation: [],
      self: this
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
    getUserInfo() {
      return this.getTeamMember(this.teamMember, "_id");
    },
    getTeamMemberShifts() {
      return this.shifts.filter(shift => {
        return shift.assigned_to == this.teamMember;
      });
    },
    getSimilarTeamMembers() {
      return this.team.filter(member => {
        return member.employee_type == this.getUserInfo.employee_type;
      });
    },
    tabItems() {
      // Each tab item will return a computed with all the information required
      return [
        {
          label: "Basic Info",
          content: "getUserInfo"
        },
        {
          label: "Shifts",
          content: "getTeamMemberShifts"
        }
      ];
    }
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