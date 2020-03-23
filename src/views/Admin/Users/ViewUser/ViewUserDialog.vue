<template>
  <el-dialog
    v-if="getActiveDialog('viewUser')"
    :visible.sync="toggleView"
    class="view_user_container"
  >
    <el-row type="flex">
      <el-col>
        <ViewUserWrapper
          :user-data="getUserInfo"
          :tab-items="tabItems"
          :current-tab="selectedTab"
          @changedTab="selectedTab = $event"
        >
          <div class="p-4">
            <component
              :is="returnComponents.component"
              :data="returnComponents.props"
              @toggle="closeDialog('viewUser')"
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
  name: "ViewUserDialog",
  data() {
    return {
      documentation: [],
      self: this,
      selectedTab: "0"
    };
  },

  computed: {
    ...mapState(["dialogIndex"]),
    ...mapState("Admin", [
      "eventsInformation",
      "teamInformation",
      "requestsInformation"
    ]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
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
      return this.currentDialog.data;
    },
    toggleView: {
      get() {
        return this.getActiveDialog("viewUser");
      },
      set(val) {
        this.closeDialog("viewUser");
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
    },
    currentDialog() {
      return this.dialogIndex.viewUser;
    },
    dialogVisible() {
      let { view, id } = this.currentDialog;
      return view && id.length > 0 && this.getIsAdmin;
    }
  },
  methods: {
    ...mapActions(["request", "closeDialog"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),

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
