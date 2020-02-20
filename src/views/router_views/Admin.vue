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
      "userInformation",
      "criticalNetworkError",
      "requestIntervals"
    ]),
    ...mapState("Admin", ["eventsInformation"]),
    hasEventsToday() {
      return this.eventsInformation.today.length > 0;
    }
  },

  deactivated() {
    clearInterval(this.adminInterval);
  },
  activated() {
    if (this.hasEventsToday) {
      this.UPDATE_NOTIFICATIONS({
        title: "Events information",
        message: "You have events scheduled for today dont forget clock in",
        desktop: {
          title: "Pending events today",
          content:
            "You have events scheduled for today, please navigate to scheme cloud to view it"
        }
      });
    }

    this.adminInterval = setInterval(() => {
      this.getTeam();
      this.getNotifications();
      this.getEvents();
    }, this.requestIntervals.events);
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
