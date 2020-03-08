<template>
  <el-dialog :visible.sync="computeDisplay">
    <div class="p-4">
      <div v-if="hasEntries(previousEvents)">
        <Event
          v-for="event in previousEvents"
          :event="event"
          :key="event._id"
        />
      </div>
      <div>
        <p>No previous events</p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import Event from "@/views/Admin/Events/components/Event";
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "PreviousEventsDialog",
  computed: {
    ...mapState("Admin", ["eventsInformation"]),
    ...mapGetters(["getActiveDialog", "closeDialog"]),

    previousEvents() {
      return this.eventsInformation.previous;
    },

    computeDisplay: {
      get() {
        return this.getActiveDialog("prevEvents");
      },
      set(val) {
        this.closeDialog("prevEvents");
      }
    }
  },
  methods: {
    ...mapActions(["closeDialog"])
  },
  components: {
    Event
  }
};
</script>

<style></style>
