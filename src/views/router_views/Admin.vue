<template>
  <div class="h-100">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <ViewTeamMemberDialog />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import ViewTeamMemberDialog from "@/views/Admin/Team/ViewTeamMemberDialog";
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
      "userInformation",
      "criticalNetworkError"
    ])
  },

  deactivated() {
    clearInterval(this.adminInterval);
  },
  activated() {
    if (!this.criticalNetworkError) {
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
    ViewTeamMemberDialog
  }
};
</script>

<style></style>
