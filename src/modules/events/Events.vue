<template>
  <div class="events_container">
    <slide-x-right-transition mode="out-in">
      <div class="events_inner_container">
        <Toolbar
          :current-view="view"
          @changeView="view = $event"
          @updateOverlays="overlays[$event] = true"
        />
        <div v-if="view == 'events'" class="events_wrapper">
          <EventsCalendar />
          <EventsOverlay
            :display="overlays.events"
            @close="overlays.events = false"
            @changeView="updateView"
          />
        </div>

        <Requests v-if="view == 'requests'" :prop-filters="requests.filters" />
      </div>
    </slide-x-right-transition>
    <TeamSidebar @changeView="updateView" />
  </div>
</template>

<script>
import { SlideXRightTransition } from "vue2-transitions";

import EventsOverlay from "./components/EventsOverlay";
import Toolbar from "./components/Toolbar";
import EventsCalendar from "./components/EventsCalendar";
import TeamSidebar from "./components/TeamSidebar";
import Requests from "./components/Requests";

export default {
  name: "Events",
  components: {
    EventsCalendar,
    EventsOverlay,
    Toolbar,
    TeamSidebar,
    Requests,
    SlideXRightTransition
  },
  data() {
    return {
      view: "events",
      requests: {
        filters: {}
      },
      overlays: {
        events: false
      }
    };
  },
  created() {
    if (Object.keys(this.$route?.params).length > 0) {
      this.updateView(this.$route.params);
    }
  },
  methods: {
    closeOverlays() {
      for (let property in this.overlays) {
        if (this.overlays[property]) {
          this.$set(this.overlays, property, false);
        }
      }
    },
    updateView({ view, teamMember }) {
      this.closeOverlays();
      this.view = view;
      this.requests.filters.requested_by = teamMember._id;
    }
  }
};
</script>
<style lang="scss" scoped>
.events_container {
  display: flex;
  flex: 1;
  height: 100%;
}
.events_wrapper {
  flex: 1;
  max-height: calc(100% - 90px);
}
.events_inner_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
