<template>
  <div class="events_timeline_container">
    <div v-if="filteredEvents.length > 0" class="events_timeline">
      <div
        v-for="event in filteredEvents"
        :key="event._id"
        :class="[
          event.timeState,
          {
            active: initMoment(event.start_date).isSame(initMoment(), 'day')
          },
          'event'
        ]"
      >
        <div class="event_info">
          <p class="grey">Timings</p>
          <h4>{{ formatDate(event.start_date) }}</h4>
          <p>{{ formatDate(event.end_date) }}</p>
        </div>
        <div class="event_info">
          <p class="grey">Event type</p>
          <h4>{{ event.type.label }}</h4>
        </div>
      </div>
    </div>
    <TextDisplay v-else :display-text="infoDisplayText">
      <i slot="header" class="bx bxs-calendar-x"></i>
      <div slot="body" class="button_container flex_center"></div>
    </TextDisplay>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "EventsTimeline",
  components: {
    TextDisplay: () => import("@/components/TextDisplay")
  },
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),

    filteredEvents() {
      return [...this.data].splice(0, 2);
    },

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

<style lang="scss" scoped>
.events_timeline {
  position: relative;
  height: 100%;
  &::after {
    position: absolute;
    content: "";
    top: 25%;
    bottom: 0;
    left: 3%;
    width: 6px;
    background: var(--colour_primary);
  }
}
.events_timeline_container {
  height: 100%;
}
.event {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  padding: 10px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    left: 0;
    border-radius: 50%;
    padding: 20px;
    border: 4px solid var(--colour_primary);
    background: white;
    z-index: 9;
  }
}
.event_info {
  text-align: center;
  flex: 1;
  text-transform: capitalize;
}
</style>
