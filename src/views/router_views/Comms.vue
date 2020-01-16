<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Comms",
  data() {
    return {
      commsInterval: null
    };
  },
  destroyed() {
    clearInterval(this.commsInterval);
  },
  created() {
    this.commsInterval = setInterval(() => {
      this.getTranscripts();
      this.getTeam();
      this.getNotifications();
    }, 5000);
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapActions(["getNotifications"])
  }
};
</script>

<style></style>
