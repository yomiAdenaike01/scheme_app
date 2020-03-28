<template>
  <el-dialog
    v-if="activeDialog.view"
    :visible.sync="toggleView"
    class="view_user_container"
  >
    <el-row type="flex">
      <el-col>
        <ViewUserWrapper
          :user-data="activeDialogData"
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
import { mapGetters, mapActions, mapMutations } from "vuex";
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
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
    ...mapGetters("Admin", ["getUsersEvents"]),
    activeDialogData() {
      return this.activeDialog.data;
    },
    activeDialog() {
      return this.getActiveDialog("viewUser");
    },
    returnComponents() {
      let selectedTab = this.selectedTab;
      let component, props;
      switch (selectedTab) {
        // Display user personal details
        case "0": {
          component = UserInfo;
          props = this.activeDialogData;
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
      let tabs = [
        {
          label: "Personal Details"
        }
      ];
      if (this.getIsAdmin) {
        tabs.push({
          label: "Events"
        });
      }
      return tabs;
    },

    toggleView: {
      get() {
        return this.activeDialog.view;
      },
      set() {
        this.closeDialog("viewUser");
      }
    },

    associatedUserEvents() {
      return this.getUsersEvents(this.activeDialogData?._id);
    }
  },
  methods: {
    ...mapActions(["request", "closeDialog"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
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
