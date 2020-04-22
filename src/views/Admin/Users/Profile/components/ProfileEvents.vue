<template>
  <div>
    <div v-if="events.length > 0">
      <h5 class="mb-2">All Events</h5>
      <FunctionalEvent
        v-for="event in events"
        :key="event._id"
        :event="event"
      />
    </div>
    <InformationDisplay v-else :display-text="infoDisplayText">
      <i slot="header" class="bx bxs-no-entry"></i>
      <div slot="body" class="button_container flex_center"></div>
    </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "UserEvents",
  components: {
    FunctionalEvent: () =>
      import("./../../../Events/components/FunctionalEvent"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  props: {
    events: {
      type: Object | Array,
      default: () => {}
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["events"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"]),
    infoDisplayText() {
      let heading = "No events to display",
        content = "All events a user is assigned to will be displayed below.";
      if (!this.getIsAdmin) {
        (heading = "Blocked"),
          (content =
            "You are blocked from viewing events that involve this user as you are not an admin.");
      }
      return {
        tag: "h2",
        heading,
        hasIcon: true,
        content
      };
    }
  },
  methods: {
    ...mapActions(["closeDialog"])
  }
};
</script>
