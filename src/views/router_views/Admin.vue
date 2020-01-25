<template>
  <div style="height:100%">
    <keep-alive :key="currentUser._id">
      <router-view></router-view>
    </keep-alive>
    <TeamMember />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import TeamMember from "@/views/Admin/Team/TeamMember";
export default {
  name: "Admin",
  data() {
    return {
      adminInterval: null
    };
  },
  computed: {
    ...mapState([
      "localSettings",
      "userNotifications",
      "currentUser",
      "critical_network_error"
    ])
  },

  deactivated() {
    clearInterval(this.adminInterval);
  },
  activated() {
    if (!this.critical_network_error) {
      this.adminInterval = setInterval(() => {
        this.getTeam();
        this.getNotifications();
        this.getShifts();
      }, 5000);
      if (this.userNotifications.length > 0) {
        this.displayNewNotification();
      }
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
  },
  components: {
    TeamMember
  }
};
</script>

<style></style>
