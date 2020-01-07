<template>
  <router-view></router-view>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";

export default {
  name: "Admin",
  data() {
    return {
      adminInterval: null
    };
  },
  computed: {
    ...mapState(["localSettings", "userNotifications", "currentUser"])
  },

  deactivated() {
    clearInterval(this.adminInterval);
  },
  activated() {
    // Starting interval
    this.adminInterval = setInterval(() => {
      this.getTeam();
      this.getNotifications();
      this.getShifts();
    }, 5000);
    if (this.userNotifications.length > 0) {
      this.displayNewNotification();
    }
  },
  methods: {
    ...mapActions("Admin", ["getTeam", "getShifts", "getNotifications"]),
    displayNewNotification() {
      let newNotification = this.userNotifications[0];
      this.UPDATE_NOTIFICATIONS({
        message: newNotification.message,
        type: "info",
        title: "New Request"
      });
    }
  }
};
</script>

<style></style>
