<template>
  <div>
    <div v-if="userEvents.length > 0">
      <h5 class="mb-2">All Events</h5>
      <Event v-for="event in userEvents" :event="Event" :key="event._id" />
    </div>
    <Nocontent v-bind="noContent" v-else>
      <el-button v-if="getIsAdmin" @click="$router.push({ name: 'schedule' })">Go to schedule</el-button>
    </Nocontent>
  </div>
</template>

<script>
import Event from "@/views/Admin/Events/components/Event";
import { mapState, mapGetters } from "vuex";
import Nocontent from "@/components/Nocontent";
export default {
  name: "TeamEventInfo",
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["eventsInformation", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin"]),
    noContent() {
      return {
        text:
          "No Events are detected for this user, you can create a Event for them below",
        icon: "el-icon-s-management"
      };
    },
    userEvents() {
      let { id } = this.viewTeamMember;
      return eventsInformation.all.filter(Event => {
        return Event.assignedTo == id;
      });
    }
  },
  components: {
    Event,
    Nocontent
  }
};
</script>

<style></style>
