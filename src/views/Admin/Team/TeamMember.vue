<template>
  <el-dialog
    :visible.sync="toggleView"
    v-if="getUserInfo"
    custom-class="teamMemberDialogContainer"
  >
    <el-row type="flex">
      <el-col>
        <Sidebar
          v-if="getUserInfo.name"
          :teamMemberData="getUserInfo"
          @changedTab="selectedTab = $event"
          :tabItems="tabItems"
        >
          <div class="content_body">
            <component
              :is="returnCorrectData.component"
              :data="returnCorrectData.props"
            />
          </div>
        </Sidebar>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import TeamUserInfo from "./components/UserInfo.vue";
import Sidebar from "./components/Sidebar";
export default {
  name: "TeamMember",
  data() {
    return {
      documentation: [],
      self: this,
      selectedTab: null
    };
  },

  computed: {
    ...mapState("Admin", ["shifts", "team", "requests", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getTeamMember"]),
    returnCorrectData() {
      let selectedTab = this.selectedTab;
      let component, props;
      switch (selectedTab) {
        // Display user personal details
        case "0": {
          component = TeamUserInfo;
          props = this.getUserInfo;
          break;
        }
        // Display user shifts
        case "1": {
          component;
          break;
        }

        default:
          break;
      }
      return {
        component,
        props
      };
    },
    tabItems() {
      // Each tab item will return a computed with all the information required
      return [
        {
          label: "Personal Details"
        },
        {
          label: "Shifts"
        },
        {
          label: "Timesheets"
        },
        {
          label: "Leave/Holiday"
        },
        {
          label: "Notes"
        }
      ];
    },
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
  },
  components: {
    TeamUserInfo,
    Sidebar
  }
};
</script>

<style lang="scss">
.teamMemberDialogContainer {
  .el-dialog__body {
    padding: 0;
    margin: 0;
  }
}
</style>
<style lang="scss" scoped>
.content_body {
  padding: 1.1em;
}
</style>
