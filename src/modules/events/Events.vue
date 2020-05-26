<template>
  <div class="events_container">
    <slide-x-right-transition mode="out-in">
      <div class="events_inner_container">
        <Toolbar
          :current-view="view"
          @changeView="view = $event"
          @updateOverlays="updateOverlays"
        />
        <div v-if="view == 'events'" class="events_wrapper">
          <EventsCalendar
            @quickCreate="updateParams"
            @updateOverlays="updateOverlays"
          />
          <EventsOverlay
            v-if="overlays.events"
            :display="overlays.events"
            :params="params"
            @close="updateOverlays({ overlay: 'events', display: false })"
            @changeView="updateView"
          />
        </div>

        <Requests
          v-if="view == 'requests'"
          :prop-filters="requests.filters"
          @changeView="updateView"
          @updateOverlays="updateOverlays"
          @approveRequest="updateParams"
        />
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
      },
      params: {}
    };
  },
  created() {
    if (Object.keys(this.$route?.params).length > 0) {
      this.updateView(this.$route.params);
    }
  },
  methods: {
    updateParams(payload) {
      this.params = payload;
    },
    updateOverlays({ overlay, display }) {
      this.overlays[overlay] = display;
    },
    closeOverlays() {
      for (let property in this.overlays) {
        if (this.overlays[property]) {
          this.overlays[property] = false;
        }
      }
    },
    updateView({ view, teamMember = null }) {
      this.view = view;
      if (teamMember) {
        this.requests.filters.requested_by = teamMember._id;
      }
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
