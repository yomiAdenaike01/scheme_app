<template>
  <div class="events_container">
    <slide-x-right-transition mode="out-in">
      <div class="events_inner_container">
        <Toolbar :current-view="view" @changeView="view = $event" />
        <div v-if="view == 'events'" class="events_wrapper">
          <EventsCalendar />
          <CreateEventOverlay
            v-if="eventModuleOverlay"
            :display="eventModuleOverlay"
            @close="closeOverlay()"
          />
          <ViewEventOverlay
            v-if="viewEventOverlay"
            :display="viewEventOverlay"
          />
        </div>

        <Requests v-if="view == 'requests'" />
      </div>
    </slide-x-right-transition>
    <UserSidebar />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { SlideXRightTransition } from "vue2-transitions";

import CreateEventOverlay from "./components/CreateEventOverlay";
import Toolbar from "./components/Toolbar";
import EventsCalendar from "./components/EventsCalendar";
import UserSidebar from "./components/UserSidebar";
import ViewEventOverlay from "./components/ViewEventOverlay";
import Requests from "./components/Requests";

export default {
  name: "EventsModule",
  components: {
    EventsCalendar,
    CreateEventOverlay,
    Toolbar,
    UserSidebar,
    ViewEventOverlay,
    Requests,
    SlideXRightTransition
  },
  data() {
    return {
      view: "events"
    };
  },
  computed: {
    ...mapGetters(["getActiveOverlay"]),
    eventModuleOverlay() {
      return this.getActiveOverlay("eventModule")?.view ?? false;
    },
    viewEventOverlay() {
      return this.getActiveOverlay("viewEvent")?.view ?? false;
    }
  }
};
</script>
<style lang="scss" scoped>
.events_container {
  display: flex;
  flex: 1;
}
.events_wrapper {
  flex: 1;
}
.events_inner_container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
