<template>
  <Overlay
    v-model="overlayController"
    class="profile_container"
    backdrop-type="dark"
    @close="$emit('close')"
  >
    <div class="profile_inner_container" type="flex">
      <ProfileContainer
        :user-data="activeOverlayData"
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
  </Overlay>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from "vuex";

import overlayEvents from "@/mixins/overlayEvents";

import Overlay from "@/components/Overlay";

import ProfileInformation from "./components/ProfileInformation";
import ProfileEvents from "./components/ProfileEvents";
import ProfileContainer from "./components/ProfileContainer";

export default {
  name: "ProfileOverlay",
  components: {
    Overlay,

    ProfileInformation,
    ProfileContainer,
    ProfileEvents
  },
  mixins: [overlayEvents],
  data() {
    return {
      selectedTab: "0",
      overlayName: "profile"
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Events", ["events"]),
    ...mapGetters(["getIsAdmin"]),

    returnComponents() {
      let selectedTab = this.selectedTab;
      let component, props;
      switch (selectedTab) {
        // Display user personal details
        case "0": {
          component = ProfileInformation;
          props = this.activeOverlayData;
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

    associatedProfileEvents() {
      let eventsArray = [];
      for (let i = 0, len = this.events.length; i < len; i++) {
        let event = this.events[i];
        let assigned_to = event.assigned_to;
        let start_date = this.initMoment(event.start_date);

        if (start_date.isBefore(this.initMoment(), "day")) {
          event.timeState = "previous";
        }
        if (start_date.isSame(this.initMoment(), "day")) {
          event.timeState = "today";
        }
        if (start_date.isAfter(this.initMoment(), "day")) {
          event.timeState = "upcoming";
        }

        for (let j = 0, jlen = assigned_to.length; j < jlen; j++) {
          let assignee = assigned_to[j];
          if (assignee._id == this.userInformation._id) {
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
  &/deep/ {
    .el-dialog__body {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
