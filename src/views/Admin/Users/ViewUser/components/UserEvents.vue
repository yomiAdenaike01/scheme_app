<template>
  <div>
    <div v-if="hasEntries(data)">
      <h5 class="mb-2">All Events</h5>
      <Event v-for="event in data" :key="event._id" :event="event" />
    </div>
    <InformationDisplay
      v-else
      class="flex_center"
      :display-text="{ heading: 'No events found for this user', content: '' }"
    >
      <div slot="header">
        <i class="bx bx-calendar-plus"></i>
      </div>
      <el-button
        slot="body"
        @click="
          UPDATE_DIALOG_INDEX({
            dialog: 'eventModule',
            view: true,
            data: { assignedTo: [getActiveDialog().data] }
          })
        "
        >Create event for this user</el-button
      >
    </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Event from "@/views/Admin/Events/components/Event";
import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "UserEvents",
  components: {
    Event,
    InformationDisplay
  },
  props: {
    data: {
      type: Object | Array,
      default: () => {}
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["eventsInformation", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin", "getActiveDialog"])
  },
  methods: {
    ...mapMutations(["UPDATE_DIALOG_INDEX"]),
    ...mapActions(["closeDialog"])
  }
};
</script>

<style></style>
