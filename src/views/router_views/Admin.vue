<template>
  <div class="admin_container">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <ProfileDialog />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import ProfileDialog from "@/views/Admin/Users/Profile/ProfileDialog";
export default {
  name: "Admin",
  components: {
    ProfileDialog
  },

  deactivated() {
    this.CLEAR_GLOBAL_INTERVAL("adminIntervals");
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

    this.CREATE_GLOBAL_INTERVAL({
      immediate: true,
      duration: 4000,
      id: "adminIntervals",
      method: () => {
        return new Promise((resolve, reject) => {
          Promise.all([
            this.getNotifications(),
            this.getEvents(),
            this.getRequests(),
            this.getTaskBoards()
          ])
            .then(() => {
              resolve();
            })
            .catch(() => {
              reject();
            });
        });
      }
    });
  },
  computed: {
    ...mapState(["userInformation", "requestIntervals"]),
    ...mapState("Admin", ["eventsInformation"]),
    hasEventsToday() {
      return this.eventsInformation.today.length > 0;
    }
  },
  methods: {
    ...mapActions("Admin", [
      "getTeam",
      "getEvents",
      "getNotifications",
      "getRequests",
      "getTaskBoards"
    ]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL", "CLEAR_GLOBAL_INTERVAL"]),
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

<style lang="scss" scoped>
.admin_container {
  display: flex;
  flex: 1;
  height: 100%;
}
</style>
