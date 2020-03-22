<template>
  <div>
    <div v-if="hasEntries(data)">
      <h5 class="mb-2">All Events</h5>
      <Event v-for="event in data" :event="event" :key="event._id" />
    </div>
  <InformationDisplay v-else class="flex_center" :displayText="{heading:'No events found for this user',content:''}">
   <div slot="header">
    <i class='bx bx-calendar-plus' ></i>
    </div>
    <el-button slot="body" @click=" UPDATE_DIALOG_INDEX({dialog:'eventModule',view:true,data:{assignedTo:[getActiveDialog().data]}});">Create event for this user</el-button>
  </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Event from "@/views/Admin/Events/components/Event";
import InformationDisplay from '@/components/InformationDisplay'
export default {
  name: "UserEvents",
  props: {
    data: {
      type: Object | Array,
      default: () => {}
    }
  },
  components: {
    Event,
    InformationDisplay
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["eventsInformation", "viewTeamMember"]),
    ...mapGetters(["getIsAdmin",'getActiveDialog'])
  
  },
  methods:{
    ...mapMutations(['UPDATE_DIALOG_INDEX']),
    ...mapActions(['closeDialog'])
  }
};
</script>

<style></style>
