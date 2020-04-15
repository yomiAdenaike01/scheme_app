<template>
  <div
    v-loading="loading"
    element-loading-text="Loading events and team members...."
    class="common_container"
  >
    <NprogressContainer />

    <AppBar @runSearch="displaySearch = $event" />
    <InstanceCheck />
    <GlobalSearch
      v-hotkey="keymap"
      :display="displaySearch"
      @closeSearch="displaySearch = false"
    />
    <div class="inner_app_container">
      <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import NprogressContainer from "vue-nprogress/src/NprogressContainer";

export default {
  name: "Common",
  components: {
    Navigation: () => import("@/components/Navigation"),
    AppBar: () => import("@/components/AppBar"),
    InstanceCheck: () => import("@/components/InstanceCheck"),
    GlobalSearch: () => import("@/components/GlobalSearch"),
    NprogressContainer
  },
  data() {
    return {
      loading: true,
      displaySearch: false
    };
  },
  computed: {
    ...mapState([
      "userInformation",
      "userNotifications",
      "viewMobileMenu",
      "weeklyTimesheetUploaded",
      "requestIntervals"
    ]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters(["getDeviceInformation", "getIsAdmin"]),
    keymap() {
      return {
        "ctrl+shift+space": this.toggleDisplaySearch
      };
    },
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
  },
  activated() {
    this.checkDevice();
    this.CREATE_GLOBAL_INTERVAL({
      immediate: true,
      duration: this.requestIntervals.admin,
      id: "team",
      method: () => {
        return new Promise((resolve, reject) => {
          this.getTeam()
            .then(() => {
              this.loading = false;
              resolve();
            })
            .catch(() => {
              this.loading = false;
              reject();
            });
        });
      }
    });

    let isVerified = this.userInformation.verified;
    if (!isVerified) {
      this.UPDATE_NOTIFICATIONS({
        title: "Activate account",
        type: "info",
        message: "Open settings to activate account."
      });
    }

    if (Notification.permission != "granted") {
      this.notificationPermission();
    }

    this.displayWeeklyNotification();
  },

  methods: {
    ...mapActions(["updateDevices"]),
    ...mapActions("Admin", ["getEvents", "getTeam"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS", "CREATE_GLOBAL_INTERVAL"]),
    toggleDisplaySearch() {
      this.displaySearch = !this.displaySearch;
    },
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
        console.log("Find device in array or add a new one");
      }
    },
    notificationPermission() {
      if (!window.Notification) {
        let {
          browser: { name, version }
        } = this.getDeviceInformation;
        this.UPDATE_NOTIFICATIONS({
          title: "Browser version error",
          message: `The current browser doesn't support notifications ${name} ${Math.round(
            parseInt(version)
          )}`
        });
      } else {
        Notification.requestPermission();
      }
    },

    displayWeeklyNotification() {
      if (
        !this.weeklyTimesheetUploaded &&
        this.returnIsStartOfWeek &&
        this.getIsAdmin
      )
        this.UPDATE_NOTIFICATIONS({
          type: "info",
          message: "Start the new week off by uploading a new weekly timesheet",
          title: "Upload Timesheet"
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.common_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
}
.inner_app_container {
  display: flex;
  flex: 1;
  height: calc(100% - 130px);

  background: rgb(251, 251, 251);
}
</style>
