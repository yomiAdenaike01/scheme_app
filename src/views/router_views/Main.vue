<template>
  <div class="main_wrapper flex columns">
    <NprogressContainer />
    <AppBar />
    <div class="inner_wrapper flex">
      <div class="nav_wrapper">
        <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
      </div>
      <el-col>
        <!-- <ServerHealth /> -->
        <DefaultTransition>
          <keep-alive>
            <router-view :key="key" />
          </keep-alive>
        </DefaultTransition>
      </el-col>
    </div>
    <NotificationsCenter />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import AppBar from "@/components/AppBar";
import Navigation from "@/components/Navigation";
import NotificationsCenter from "@/components/NotificationsCenter";
import moment, * as moments from "moment";
import ServerHealth from "@/components/ServerHealth";
import CriticalError from "@/components/CriticalError";
import InvalidClient from "@/components/InvalidClient";
import NprogressContainer from "vue-nprogress/src/NprogressContainer";
import DefaultTransition from "@/components/DefaultTransition";
export default {
  name: "Main",

  activated() {
    this.checkServerHealth();

    let isVerified = this.userInformation.verified;
    if (!isVerified) {
      this.UPDATE_NOTIFICATIONS({
        title: "Activate account",
        type: "info",
        message: "Open settings to activate account."
      });
    }
    let { general } = this.userInformation.settings;
    if (Notification.permission != "granted") {
      this.requestNotificationPermission();
    }

    this.displayWeeklyNotification();
  },
  computed: {
    key() {
      return this.$route.path;
    },
    ...mapState([
      "notifications",
      "globalLoader",
      "userInformation",
      "userNotifications",
      "viewMobileMenu",
      "defaultSize",
      "criticalNetworkError",
      "weeklyTimesheetUploaded",
      "localSettings"
    ]),
    ...mapState("Admin", ["shifts", "teamInformation"]),
    returnIsStartOfWeek() {
      return moment().get("day") <= 1;
    }
  },

  methods: {
    ...mapActions(["checkServerHealth"]),
    ...mapMutations([
      "REMOVE_USER",
      "UPDATE_NOTIFICATIONS",
      "UPDATE_VIEW_NOTIFICATIONS_CENTER"
    ]),

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
    },

    displayWeeklyNotification() {
      if (!this.weeklyTimesheetUploaded && this.returnIsStartOfWeek)
        this.UPDATE_NOTIFICATIONS({
          type: "info",
          message: "Start the new week off by uploading a new weekly timesheet",
          title: "Upload Timesheet"
        });
    }
  },
  components: {
    Navigation,
    AppBar,
    NotificationsCenter,
    ServerHealth,
    NprogressContainer,
    DefaultTransition
  }
};
</script>

<style lang="scss" scoped>
.main_wrapper {
  height: 100%;
  width: 100%;
  flex: 1;
}
.inner_wrapper {
  flex: 1;
}
</style>
