<template>
  <keep-alive :key="currentUser._id">
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Comms",
  data() {
    return {
      commsInterval: null
    };
  },
  deactivated() {
    clearInterval(this.commsInterval);
  },
  activated() {
    if (!this.critical_network_error) {
      this.commsInterval = setInterval(() => {
        this.getTranscripts();
        this.getTeam();
        this.getNotifications();
      }, 5000);
    }
  },
  computed: {
    ...mapState(["currentUser", "critical_network_error"])
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapActions(["getNotifications"])
  }
};
</script>

<style></style>
