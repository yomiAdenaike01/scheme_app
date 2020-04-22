<template>
  <el-dialog
    v-if="activeDialog.view"
    :visible.sync="toggleView"
    class="profile_container"
  >
    <div class="profile_inner_container" type="flex">
      <ProfileContainer
        :user-data="activeDialogData"
        :tab-items="tabItems"
        :current-tab="selectedTab"
        @changedTab="selectedTab = $event"
      >
        <component
          :is="returnComponents.component"
          :data="returnComponents.props"
        />
      </ProfileContainer>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";
import ProfileInformation from "./components/ProfileInformation";
import ProfileEvents from "./components/ProfileEvents";
import ProfileContainer from "./components/ProfileContainer";

export default {
  name: "ProfileDialog",
  components: {
    ProfileInformation,
    ProfileContainer,
    ProfileEvents
  },
  data() {
    return {
      selectedTab: "0"
    };
  },

  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["events"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
    activeDialogData() {
      return this.activeDialog.data;
    },
    activeDialog() {
      return this.getActiveDialog("profile");
    },
    returnComponents() {
      let selectedTab = this.selectedTab;
      let component, props;
      switch (selectedTab) {
        // Display user personal details
        case "0": {
          component = ProfileInformation;
          props = this.activeDialogData;
          break;
        }
        // Display user shifts
        case "1": {
          component = ProfileEvents;
          props = this.associatedProfileEvents;
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
        this.closeDialog("profile");
      }
    },

    associatedProfileEvents() {
      let eventsArray = [];
      for (let i = 0, len = this.events.length; i < len; i++) {
        let event = this.events[i];
        let assignedTo = event.assignedTo;
        let startDate = this.initMoment(event.startDate);

        if (startDate.isBefore(this.initMoment(), "day")) {
          event.timeState = "previous";
        }
        if (startDate.isSame(this.initMoment(), "day")) {
          event.timeState = "today";
        }
        if (startDate.isAfter(this.initMoment(), "day")) {
          event.timeState = "upcoming";
        }

        for (let j = 0, jlen = assignedTo.length; j < jlen; j++) {
          let assignee = assignedTo[j];
          if (assignee._id == this.userInformation._id) {
            eventsArray.push(event);
          }
        }
      }
      return eventsArray;
    }
  },
  methods: {
    ...mapActions(["request", "closeDialog"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
  }
};
</script>

<style lang="scss">
.profile_container {
  &/deep/ {
    .el-dialog__body {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
