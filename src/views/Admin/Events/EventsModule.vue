<template>
  <div class="events_container">
    <div class="events_inner_container">
      <Toolbar :current-view="view" @changeView="view = $event" />
      <div v-if="view != 'requests'">
        <EventsCalendar />
        <EventModuleDialog />
        <ViewEventDialog />
      </div>
      <Requests v-if="view == 'requests'" />
    </div>
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
export default {
  name: "EventsModule",
  components: {
    EventsCalendar,
    EventModuleDialog,
    Toolbar,
    UserSidebar,
    ViewEventDialog,
    Requests
  },
  extends: eventsTour,
  data() {
    return {
      view: "requests"
    };
  }
};
</script>
<style lang="scss" scoped>
.events_container {
  display: flex;
  flex: 1;
}
.events_inner_container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>
