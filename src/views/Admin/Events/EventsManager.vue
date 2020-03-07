<template>
  <div
    class="eventmanager_container"
    v-loading="loading"
    element-loading-text="Loading team members and events please wait..."
  >
    <!-- Shift and calendar view -->
    <EventFilters v-if="$mq == 'lg'" />

    <div class="eventmanager_inner_container">
      <Toolbar class="m-3" />

      <EventsCalendar
        @refreshShift="getEvents"
        @displayCreateEvent="modals.createEvent = $event"
      />
      <EventMangerDialog />
      <ViewEventDialog />
    </div>
    <UserSidebar />
  </div>
</template>

<script>
import dates from "@/mixins/dates";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import EventMangerDialog from "./components/EventMangerDialog";
import Toolbar from "./components/Toolbar";
import EventsCalendar from "./components/EventsCalendar";
import Title from "@/components/Title";
import EventFilters from "./components/EventFilters";
import UserSidebar from "./components/UserSidebar";
import ViewEventDialog from "./components/ViewEventDialog";

export default {
  name: "EventsManager",
  created() {
    this.UPDATE_DIALOG_INDEX({
      dialog: "tutorial",
      view: true,
      data: "scheduling"
    });
  },
  activated() {
    this.loading = true;
    Promise.all([this.getEvents(), this.getTeam()]).then(response => {
      this.loading = false;
    });
  },
  data() {
    return {
      loading: false
    };
  },

  methods: {
    ...mapActions("Admin", ["getEvents", "getTeam"]),
    ...mapMutations(["UPDATE_DIALOG_INDEX"])
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
.eventmanager_container {
  display: flex;
  flex: 1;
  overflow: auto;
}
.eventmanager_inner_container {
  flex: 1;
}
</style>
