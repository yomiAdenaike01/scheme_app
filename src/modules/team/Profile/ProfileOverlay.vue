<template>
  <el-drawer :visible.sync="syncView" class="profile_container">
    <div class="profile_inner_container">
      <ProfileContainer
        :user-data="overlayIndex.profile.data"
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
  </el-drawer>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

import ProfileInformation from "./components/ProfileInformation";
import EventsTimeline from "./components/EventsTimeline";
import ProfileContainer from "./components/ProfileContainer";

export default {
  name: "ProfileOverlay",
  components: {
    ProfileInformation,
    ProfileContainer,
    EventsTimeline
  },
  data() {
    return {
      selectedTab: "0",
      overlayName: "profile"
    };
  },
  computed: {
    ...mapState(["userInformation", "overlayIndex"]),
    ...mapState("Events", ["events"]),
    ...mapGetters(["getIsAdmin"]),

    syncView: {
      get() {
        return this.overlayIndex.profile.view;
      },
      set() {
        this.closeOverlay("profile");
      }
    },
    returnComponents() {
      let selectedTab = this.selectedTab;
      let component, props;
      switch (selectedTab) {
        // Display user personal details
        case "0": {
          component = ProfileInformation;
          props = this.overlayIndex.profile.data;
          break;
        }
        // Display user shifts
        case "1": {
          component = EventsTimeline;
          props = this.associatedEventsTimeline;
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
          label: "Events timeline"
        });
      }
      return tabs;
    },

    associatedEventsTimeline() {
      let eventsArray = [];
      for (let i = 0, len = this.events.length; i < len; i++) {
        let event = this.events[i];
        let assigned_to = event.assigned_to;
        let startDate = this.initMoment(event.start_date);
        for (let j = 0, jlen = assigned_to.length; j < jlen; j++) {
          let assignee = assigned_to[j];
          if (assignee._id == this.overlayIndex.profile.data._id) {
            if (startDate.isBefore(this.initMoment(), "day")) {
              event.timeState = "previous";
            }
            if (startDate.isSame(this.initMoment(), "day")) {
              event.timeState = "today";
            }
            if (startDate.isAfter(this.initMoment(), "day")) {
              event.timeState = "upcoming";
            }
            eventsArray.push(event);
          }
        }
      }
      return eventsArray;
    }
  },

  methods: {
    ...mapActions(["request", "closeOverlay"]),
    ...mapMutations(["UPDATE_OVERLAY_INDEX"])
  }
};
</script>

<style lang="scss">
.profile_container {
  height: 100%;
}
</style>
