<template>
  <div class="h-100">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <ViewUser />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import ViewUser from "@/views/Admin/Users/ViewUser/ViewUser";
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
        this.getEvents();
      }, 60 * 3000);
      if (this.userNotifications.length > 0) {
        this.displayNewNotification();
      }
    }
  },
  methods: {
    ...mapActions("Admin", ["getTeam", "getEvents", "getNotifications"]),
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
    ViewUser
  },
  watch: {
    criticalNetworkError() {
      clearInterval(this.adminInterval);
    }
  }
};
</script>

<style></style>
