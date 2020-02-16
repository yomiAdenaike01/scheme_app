<template>
  <el-dialog :visible.sync="toggleView" class="view_user_container" v-if="hasEntries(getUserInfo)">
    <el-row type="flex">
      <el-col>
        <ViewUserWrapper
          :userData="getUserInfo"
          @changedTab="selectedTab = $event"
          :tabItems="tabItems"
          :currentTab="selectedTab"
        >
          <div class="p-4">
            <component
              :is="returnComponents.component"
              :data="returnComponents.props"
              @toggle="UPDATE_VIEW_TEAM_MEMBER({ view: false, id: null })"
            />
          </div>
        </ViewUserWrapper>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import UserInfo from "./components/UserInfo";
import UserEvents from "./components/UserEvents";
import ViewUserWrapper from "./components/ViewUserWrapper";

export default {
  name: "ViewUser",
  data() {
    return {
      documentation: [],
      self: this,
      selectedTab: "0"
    };
  },

  computed: {
    ...mapState("Admin", [
      "eventsInformation",
      "teamInformation",
      "requestsInformation",
      "viewTeamMember"
    ]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getUserInformation", "getUsersEvents"]),
    returnComponents() {
      let selectedTab = this.selectedTab;
      let component, props;
      switch (selectedTab) {
        // Display user personal details
        case "0": {
          component = UserInfo;
          props = this.getUserInfo;
          break;
        }
        // Display user shifts
        case "1": {
          component = UserEvents;
          props = this.associatedUserEvents;
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
          label: "Events"
        }
      ];
    },
    userID() {
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
      let teamInfo = this.getUserInformation(this.userID);
      return teamInfo;
    },

    getSimilarTeamMembers() {
      return this.teamInformation.filter(member => {
        return member.groupID == this.getUserInfo.groupID;
      });
    },
    associatedUserEvents() {
      return this.getUsersEvents(this.userID);
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Admin", ["UPDATE_VIEW_TEAM_MEMBER"]),

    getDocumentation() {
      this.request({
        method: "GET",
        params: { id: this.teamInformationMember },
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
    UserInfo,
    ViewUserWrapper,
    UserEvents
  }
};
</script>

<style lang="scss">
.view_user_container {
  &/deep/ {
    .el-dialog__body {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
