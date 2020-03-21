<template>
  <div class="h-100" v-loading='loading'>
    <NprogressContainer />
    <AppBar />
    <div class="main_wrapper flex">
      <div class="inner_wrapper h-100 flex">
        <div class="nav_wrapper">
          <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
        </div>
        <el-col class="main_col_container">
          <InstanceCheck />
          <DefaultTransition>
            <keep-alive>
              <router-view />
            </keep-alive>
          </DefaultTransition>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import NprogressContainer from "vue-nprogress/src/NprogressContainer";

import AppBar from "@/components/AppBar";
import Navigation from "@/components/Navigation";
import DefaultTransition from "@/components/DefaultTransition";
import InstanceCheck from "@/components/InstanceCheck";
export default {
  name: "Main",
  data(){
    return{
      loading:true
    }
  },
  activated() {
    this.checkDevice();
      Promise.all([this.getEvents(), this.getTeam()]).then(
      response => {
        this.loading = false;
      }
    );

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
    components: {
    Navigation,
    AppBar,
    NprogressContainer,
    DefaultTransition,
    InstanceCheck
  },
  computed: {
    ...mapState([
      "userInformation",
      "userNotifications",
      "viewMobileMenu",
      "weeklyTimesheetUploaded"
    ]),
    ...mapGetters(["getUAInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    returnIsStartOfWeek() {
      return this.initMoment().get("day") <= 1;
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
    ...mapActions(["updateDevices"]),
    ...mapActions('Admin',['getEvents','getTeam']),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    triggerDeviceNotification() {
      this.UPDATE_NOTIFICATIONS({
        title: "Register new device detected",
        message:
          "Would you like this device to be added to your library  (click to confirm) ?",
        click: () => {
          this.updateDevices();
        },
        type: "info"
      });
    },
    checkDevice() {
      if (this.userInformation?.devicesInformation?.length === 0) {
        this.triggerDeviceNotification();
      } else {
        // Find in array
        let deviceIndex = this.userInformation?.devicesInformation?.findIndex(
          ({ os: { name, version } }) => {
            return (
              name === this.getUAInformation.os.name &&
              version === this.getUAInformation.os.version
            );
          }
        );
        if (deviceIndex == -1) {
          this.triggerDeviceNotification();
        }
      }
    },
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
          let userNoty = this.userNotifications;
          for (let i = 0, len = userNoty.length; i < len; i++) {
            this.UPDATE_NOTIFICATIONS(userNoty[i]);
          }
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
  height: calc(100% - #{$app_bar_height});
}
.inner_wrapper {
  flex: 1;
}
</style>
