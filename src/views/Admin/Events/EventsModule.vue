<template>
  <div v-loading="loading" class="eventModule_container h-100">
    <div class="eventModule_inner_container h-100 overflow">
      <Toolbar class="m-3" />
      <EventsCalendar
        @refreshShift="getEvents"
        @displayCreateEvent="modals.createEvent = $event"
      />
      <EventModuleDialog />
      <ViewEventDialog />
    </div>
    <UserSidebar />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

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
      loading: true,
      getTemplatesInterval: null
    };
  },
  activated() {
    this.getTemplates()
      .then(response => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
    clearInterval(this.getTemplatesInterval);
    this.getTemplatesInterval = setInterval(() => {
      this.getTemplates();
    }, this.requestIntervals.templates);
  },
  deactivated() {
    clearInterval(this.getTemplatesInterval);
  },
  methods: {
    ...mapActions("Admin", ["getEvents", "getTeam", "getTemplates"])
  },
  computed: {
    ...mapState(["requestIntervals"])
  }
};
</script>
<style lang="scss" scoped>
.eventModule_container {
  display: flex;
  flex: 1;
  overflow: auto;
}
.eventModule_inner_container {
  flex: 1;
}
</style>
