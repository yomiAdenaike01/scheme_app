<template>
  <div>
    <div v-if="hasEntries(data)">
      <h5 class="mb-2">All Events</h5>
      <Event v-for="event in data" :event="event" :key="event._id" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Event from "@/views/Admin/Events/components/Event";
export default {
  name: "UserEvents",
  props: {
    data: {
      type: Object | Array,
      default: () => {}
    }
  },
  components: {
    Event
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["eventsInformation", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin"])
  }
};
</script>

<style></style>
