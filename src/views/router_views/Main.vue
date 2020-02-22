<template>
  <div class="main_wrapper flex columns">
    <NprogressContainer />
    <AppBar />
    <div class="inner_wrapper flex">
      <div class="nav_wrapper">
        <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
      </div>
      <el-col class="main_col_container">
        <!-- <ServerHealth /> -->
        <DefaultTransition>
          <keep-alive>
            <router-view :key="key" />
          </keep-alive>
        </DefaultTransition>
      </el-col>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import AppBar from "@/components/AppBar";
import Navigation from "@/components/Navigation";
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
      "localNotifications",
      "globalLoader",
      "userInformation",
      "userNotifications",
      "viewMobileMenu",
      "defaultSize",
      "criticalNetworkError",
      "weeklyTimesheetUploaded",
      "localSettings"
    ]),
    ...mapGetters(["getUAInformation"]),
    ...mapState("Admin", ["shifts", "teamInformation"]),
    returnIsStartOfWeek() {
      return moment().get("day") <= 1;
    },
    hasRequestOrNotifications() {
      return this.userNotifications.length > 0;
    },
    hasReminder() {
      return (
        this.userNotifications.findIndex(({ type, status }) => {
          return type == "reminder" && status == "unread";
        }) > -1
      );
    },
    hasAnnoucement() {
      return (
        this.userNotifications.findIndex(({ type, status }) => {
          return type == "attention" && status == "unread";
        }) > -1
      );
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
        let {
          browser: { name, version }
        } = this.getUAInformation;
        this.UPDATE_NOTIFICATIONS({
          title: "Browser version error",
          message: `The current browser doesn't support notifications ${name} ${Math.round(
            parseInt(version)
          )}`
        });
      } else {
        Notification.requestPermission()
          .then(p => {
            console.log(p);
          })
          .catch(err => {
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
    ServerHealth,
    NprogressContainer,
    DefaultTransition
  },
  watch: {
    hasAnnoucement: {
      immediate: true,
      handler(val) {
        if (val) {
          let notificationTitle =
            "A notification requires your attention, press the bell icon to view them";
          this.UPDATE_NOTIFICATIONS({
            title: "Attention",
            message: notificationTitle,
            type: "info",
            desktop: {
              title: "A notification requires your attention",
              content: {
                body: notificationTitle
              }
            }
          });
        }
      }
    },
    hasRequestOrNotifications: {
      immediate: true,
      handler(val) {
        if (val) {
          this.UPDATE_NOTIFICATIONS({
            title: "Pending notifications",
            message:
              "You have notifications pending, press the bell to view them",
            type: "info"
          });
        }
      }
    },
    hasReminder: {
      immediate: true,

      handler(val) {
        if (val) {
          let notificationTitle =
            "You have a reminder scheduled, close the notification to complete the reminder";
          this.UPDATE_NOTIFICATIONS({
            title: "Reminder",
            message: notificationTitle,
            type: "info",
            desktop: {
              title: "You have reminder",
              content: {
                body: notificationTitle
              }
            }
          });
        }
      }
    }
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
.main_col_container {
  flex: 1;
}
</style>
