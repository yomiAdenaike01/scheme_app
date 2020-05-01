<template>
  <div>
    <div v-if="events.length > 0">
      <h5 class="mb-2">All Events</h5>
      {{ events }}
    </div>
    <TextDisplay v-else :display-text="infoDisplayText">
      <i slot="header" class="bx bxs-no-entry"></i>
      <div slot="body" class="button_container flex_center"></div>
    </TextDisplay>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "ProfileEvents",
  components: {
    TextDisplay: () => import("@/components/TextDisplay")
  },
  props: {
    events: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin", "getActiveOverlay"]),
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
    ...mapActions(["closeOverlay"])
  }
};
</script>
