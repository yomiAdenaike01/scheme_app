<template>
  <div class="events_container">
    <div class="events_sub_container">
      <!-- Toolbar -->

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
    <TeamSidebar />
  </div>
</template>

<script>
import { SlideXRightTransition } from "vue2-transitions";

import EventsOverlay from "./components/EventsOverlay";
import EventsCalendar from "./components/EventsCalendar";
import TeamSidebar from "./components/TeamSidebar";
import { mapGetters } from "vuex";

export default {
  name: "Events",
  components: {
    EventsCalendar,
    EventsOverlay,
    TeamSidebar,
    SlideXRightTransition
  },
  data() {
    return {
      overlays: {
        events: false
      },
      params: {}
    };
  },
  computed: {
    ...mapGetters(["adminPermission"])
  },
  created() {
    this.handleRouting();
  },

  methods: {
    handler() {
      this.updateOverlays({
        overlay: "events",
        display: true
      });
    },
    handleRouting() {
      let routeParams = this.$route.params;
      if (Object.keys(routeParams).length > 0) {
        if (routeParams?.overlay) {
          this.updateOverlays(routeParams);
        }
        if (routeParams?.createEvent) {
          this.params = routeParams.createEvent.params;
          this.overlays.events = true;
        }
      }
    },
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
.events_sub_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
