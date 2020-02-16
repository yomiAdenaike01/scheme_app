<template>
  <div>
    <div v-if="hasEntries(data)">
      <h5 class="mb-2">All Events</h5>
      <Event v-for="event in data" :event="event" :key="event._id" />
    </div>
    <Nocontent v-bind="noContent" v-else>
      <el-button
        v-if="getIsAdmin"
        :disabled="$route.name == 'events'"
        @click="
          $router.push({ name: 'events' });
          $emit('toggle');
        "
      >{{$route.name == 'events' ? 'Already in events' : 'Go to events'}}</el-button>
    </Nocontent>
  </div>
</template>

<script>
import Event from "@/views/Admin/Events/components/Event";
import { mapState, mapGetters } from "vuex";
import Nocontent from "@/components/Nocontent";
export default {
  name: "UserEvents",
  props: {
    data: {
      type: Object | Array,
      default: () => {}
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["eventsInformation", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin"]),
    noContent() {
      return {
        text:
          "No events are detected for this user, you can create a event for them below",
        icon: "el-icon-s-management"
      };
    }
  },
  components: {
    Event,
    Nocontent
  }
};
</script>

<style></style>
