<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Admin",
  data() {
    return {
      adminInterval: null
    };
  },
  computed: {
    ...mapState(["localSettings", "userNotifications"])
  },
  deactivated() {
    clearInterval(this.adminInterval);
  },
  activated() {
    let general = this.localSettings.general;
    console.log(general.live_dashboard);
    if (Notification.permission != "granted") {
      this.requestNotificationPermission();
    }
    this.genNotifications();

    if (general.live_dashbboard) {
      this.adminInterval = setInterval(() => {
        this.getTeam();
        this.getNotifications();
        this.getShifts();
      }, 5000);
    }
  },
  methods: {
    ...mapActions("Admin", ["getTeam", "getShifts"]),
    ...mapActions(["getNotifications"]),
    genNotifications() {
      let notifications = this.userNotifications;
      let len = notifications.length;
      for (let i = 0; i < len; i++) {
        const notification = notifications[i];
        new Notification(notification.message);
      }
    },
    requestNotificationPermission() {
      if (!window.Notification) {
        console.log("Browser does not support notifications.");
      } else {
        Notification.requestPermission()
          .then(p => {
            if (p === "granted") {
              // show notification here
            } else {
              console.log("User blocked notifications.");
            }
          })
          .catch(function(err) {
            console.error(err);
          });
      }
    }
  }
};
</script>

<style></style>
