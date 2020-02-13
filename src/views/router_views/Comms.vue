<template>
  <keep-alive :key="userInformation._id">
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
    if (!this.criticalNetworkError) {
      this.commsInterval = setInterval(() => {
        this.getTranscripts();
        this.getTeam();
        this.getNotifications();
      }, 5000);
    }
  },
  computed: {
    ...mapState(["userInformation", "criticalNetworkError"])
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapActions(["getNotifications"])
  },
    watch:{
    criticalNetworkError(){
        clearInterval(this.commsInterval);
    }
  }
};
</script>

<style></style>
