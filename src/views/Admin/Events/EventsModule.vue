<template>
  <div class="events_container">
    <slide-x-right-transition mode="out-in">
      <div class="events_inner_container">
        <Toolbar :current-view="view" @changeView="view = $event" />
        <div v-if="view == 'events'" class="events_wrapper">
          <EventsCalendar />
          <EventModuleDialog />
          <ViewEventDialog />
        </div>

        <Requests v-if="view == 'requests'" />
      </div>
    </slide-x-right-transition>

    <UserSidebar />
  </div>
</template>

<script>
import EventModuleDialog from "./components/EventModuleDialog";
import Toolbar from "./components/Toolbar";
import EventsCalendar from "./components/EventsCalendar";
import UserSidebar from "./components/UserSidebar";
import ViewEventDialog from "./components/ViewEventDialog";
import eventsTour from "../tours/eventsTour";
import Requests from "./components/Requests";
import { SlideXRightTransition } from "vue2-transitions";

export default {
  name: "EventsModule",
  components: {
    EventsCalendar,
    EventModuleDialog,
    Toolbar,
    UserSidebar,
    ViewEventDialog,
    Requests,
    SlideXRightTransition
  },
  extends: eventsTour,
  data() {
    return {
      view: "events"
    };
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
