<template>
  <div class="events_container">
    <div class="events_inner_container">
      <Toolbar />
      <EventsCalendar />
      <EventModuleDialog />
      <ViewEventDialog />
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

export default {
  name: "EventsModule",
  components: {
    EventsCalendar,
    EventModuleDialog,
    Toolbar,
    UserSidebar,
    ViewEventDialog
  },
  data() {
    return {
      getTemplatesInterval: null
    };
  }
};
</script>
<style lang="scss" scoped>
.events_container {
  display: flex;
  flex: 1;
  overflow: auto;
  height: 100%;
}
.events_inner_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
}
</style>
