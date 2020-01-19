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
    this.$destroy();
  },
  activated() {
    this.commsInterval = setInterval(() => {
      this.getTranscripts();
      this.getTeam();
      this.getNotifications();
    }, 5000);
  },
  computed: {
    ...mapState(["currentUser"])
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapActions(["getNotifications"])
  }
};
</script>

<style></style>
