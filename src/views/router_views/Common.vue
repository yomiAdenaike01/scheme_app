<template>
  <div
    v-loading="loading"
    element-loading-text="Loading events and team members...."
    class="common_container"
  >
    <NprogressContainer />
    <AppBar @runSearch="displaySearch = $event" />
    <div v-if="systemNotifications.length > 0" class="notification_container">
      <s-notification
        v-for="notification in systemNotifications"
        :key="notification._id"
        v-bind="notification"
      ></s-notification>
    </div>
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
import { SlideXRightTransition } from "vue2-transitions";

export default {
  name: "Common",
  components: {
    SNotification: () => import("@/components/SNotification"),
    Navigation: () => import("@/components/Navigation"),
    AppBar: () => import("@/components/AppBar"),
    GlobalSearch: () => import("@/components/GlobalSearch"),
    SButton: () => import("@/components/SButton"),

    NprogressContainer,
    SlideXRightTransition
  },
  data() {
    return {
      loading: true,
      displaySearch: false,
      display: true
    };
  },
  computed: {
    ...mapState([
      "userInformation",
      "apiNotifications",
      "systemNotifications",
      "requestIntervals"
    ]),
    ...mapState("Admin", ["team"]),
    ...mapGetters(["getDeviceInformation", "getIsAdmin"]),

    keymap() {
      return {
        "ctrl+shift+space": this.toggleDisplaySearch
      };
    }
  },

  activated() {
    this.checkDevice();
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
            this.getBoards(),
            this.getTeam()
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

    let isVerified = this.userInformation.verified;
    if (!isVerified) {
      this.CREATE_SYSTEM_NOTIFICATION({
        type: "info",
        message: "Open settings to activate account."
      });
    }

    if (Notification.permission != "granted") {
      this.notificationPermission();
    }
  },

  methods: {
    ...mapActions(["request", "updateDevices"]),
    ...mapMutations("Admin", ["UPDATE_BOARDS"]),
    ...mapMutations([
      "CREATE_SYSTEM_NOTIFICATION",
      "CREATE_GLOBAL_INTERVAL",
      "CLEAR_GLOBAL_INTERVAL",
      "UPDATE_API_NOTIFICATIONS",
      "UPDATE_TEAM"
    ]),
    getBoards() {
      return new Promise((resolve, reject) => {
        this.request({
          method: "GET",
          url: "tasks/boards"
        })
          .then(response => {
            this.UPDATE_BOARDS({ data: response, action: "update" });
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getTasks() {
      return new Promise((resolve, reject) => {
        this.request({
          method: "GET",
          url: "tasks/get"
        })
          .then(response => {
            this.UPDATE_BOARDS(response);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    getNotifications() {
      return new Promise((resolve, reject) => {
        const payload = {
          method: "GET",
          url: "/notifications/all"
        };
        this.request(payload)
          .then(response => {
            this.UPDATE_API_NOTIFICATIONS(response);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },

    getTeam() {
      return new Promise((resolve, reject) => {
        const payload = {
          method: "GET",
          url: "/users/all"
        };
        this.request(payload)
          .then(response => {
            this.UPDATE_TEAM(response);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    toggleDisplaySearch() {
      this.displaySearch = !this.displaySearch;
    },
    triggerDeviceNotification() {
      this.CREATE_SYSTEM_NOTIFICATION({
        message:
          "Would you like this device to be added to your library  (click to confirm) ?",
        click: () => {
          this.updateDevices();
        },
        type: "info"
      });
    },

    checkDevice() {
      if (this.userInformation?.devices_information?.length === 0) {
        this.triggerDeviceNotification();
      } else {
        // Find in array
        console.log("Find device in array or add a new one");
      }
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
  position: relative;
}
.notification_container {
  position: fixed;
  top: 2%;
  bottom: 0;
  right: 0;
  left: 85%;
  z-index: 15;
}
.inner_app_container {
  display: flex;
  flex: 1;
  height: calc(100% - 100px);
  background: rgb(251, 251, 251);
}
</style>
