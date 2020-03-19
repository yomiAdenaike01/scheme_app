<template>
  <div
    class="eventModule_container h-100"
    v-loading="loading"
    element-loading-text="Loading team members and events please wait..."
  >
    <!-- Shift and calendar view -->
    <EventFilters v-if="$mq == 'lg'" />

    <div class="eventModule_inner_container h-100 overflow">
      <Toolbar class="m-3" />

      <EventsCalendar @refreshShift="getEvents" @displayCreateEvent="modals.createEvent = $event" />
      <EventMangerDialog />
      <ViewEventDialog />
    </div>
    <UserSidebar />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import EventMangerDialog from "./components/EventMangerDialog";
import Toolbar from "./components/Toolbar";
import EventsCalendar from "./components/EventsCalendar";
import Title from "@/components/Title";
import EventFilters from "./components/EventFilters";
import UserSidebar from "./components/UserSidebar";
import ViewEventDialog from "./components/ViewEventDialog";
export default {
  name: "EventsModule",
  created() {
    this.UPDATE_DIALOG_INDEX({
      dialog: "tutorial",
      view: true,
      data: "scheduling"
    });
  },

  data() {
    return {
      loading: false,
      getTemplatesInterval: null
    };
  },
  deactivated() {
    clearInterval(this.getTemplatesInterval);
  },
  activated() {
    this.loading = true;
    clearInterval(this.getTemplatesInterval);
    this.getTemplatesInterval = setInterval(() => {
      this.getTemplates();
    }, this.requestIntervals.templates);
    Promise.all([this.getEvents(), this.getTeam(), this.getTemplates()]).then(
      response => {
        this.loading = false;
      }
    );
  },
  methods: {
    ...mapActions("Admin", ["getEvents", "getTeam", "getTemplates"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
  },
  computed: {
    ...mapState(["requestIntervals"])
  },

  components: {
    EventsCalendar,
    EventMangerDialog,
    Toolbar,
    EventFilters,
    UserSidebar,
    ViewEventDialog
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
