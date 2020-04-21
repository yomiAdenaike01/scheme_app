<template>
  <div class="admin_container">
    <keep-alive>
      <slide-x-left-transition mode="out-in">
        <router-view></router-view>
      </slide-x-left-transition>
    </keep-alive>
    <ProfileDialog />
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import ProfileDialog from "@/views/Admin/Users/Profile/ProfileDialog";
import { SlideXLeftTransition } from "vue2-transitions";

export default {
  name: "Admin",
  components: {
    ProfileDialog,
    SlideXLeftTransition
  },
  computed: {
    ...mapState(["userInformation", "requestIntervals"]),
    ...mapState("Admin", ["events"])
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
      duration: this.requestIntervals.admin,
      id: "adminIntervals",
      method: () => {
        return new Promise((resolve, reject) => {
          Promise.all([
            this.getNotifications(),
            this.getEvents(),
            this.getRequests(),
            this.getBoards()
          ])
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject(err);
            });
        });
      }
    });
  },

  methods: {
    ...mapActions("Admin", [
      "getTeam",
      "getEvents",
      "getNotifications",
      "getRequests",
      "getBoards"
    ]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL", "CLEAR_GLOBAL_INTERVAL"])
  }
};
</script>

<style lang="scss" scoped>
.admin_container {
  display: flex;
  flex: 1;
}
</style>
