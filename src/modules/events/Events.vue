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
          />
        </div>

        <Requests v-if="view == 'requests'" />
      </div>
    </slide-x-right-transition>
    <TeamSidebar />
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
      overlays: {
        events: false
      }
    };
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
