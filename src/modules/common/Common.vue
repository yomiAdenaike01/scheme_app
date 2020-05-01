<template>
  <div
    v-loading="loading"
    element-loading-text="Loading events and team members...."
    class="common_container"
  >
    <NprogressContainer />
    <CommonBar @search="displaySearch = $event" />
    <div v-if="systemNotifications.length > 0" class="notification_container">
      <Notification
        v-for="notification in systemNotifications"
        :key="notification._id"
        v-bind="notification"
      ></Notification>
    </div>
    <SearchOverlay
      v-hotkey="keymap"
      :display="displaySearch"
      @close="displaySearch = false"
    />
    <div class="inner_common_container">
      <Navigation />
      <keep-alive>
        <slide-x-left-transition mode="out-in">
          <router-view></router-view>
        </slide-x-left-transition>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import NprogressContainer from "vue-nprogress/src/NprogressContainer";
import { SlideXLeftTransition } from "vue2-transitions";

import CommonBar from "./components/CommonBar";
import Navigation from "./components/Navigation";
import SearchOverlay from "./components/SearchOverlay";

import Notification from "@/modules/notifications/components/Notification";
import SButton from "@/components/SButton";

export default {
  name: "Common",
  components: {
    NprogressContainer,
    SlideXLeftTransition,

    CommonBar,
    Navigation,
    Notification,
    SButton,
    SearchOverlay
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
    ...mapState(["team"]),
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
      immediateCallback: () => {
        this.loading = false;
      },
      duration: this.requestIntervals.admin,
      id: "adminIntervals",
      method: () => {
        return new Promise((resolve, reject) => {
          Promise.all([
            this.getNotifications(),
            this.getEvents(),
            this.getRequests(),
            this.getBoards(),
            this.getTeam(),
            this.getEventTemplates()
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

    if (window.Notification.permission != "granted") {
      // request notification permission
      window.Notification.requestPermission();
    }
  },

  methods: {
    ...mapActions(["request", "updateDevices"]),
    ...mapMutations([
      "CREATE_SYSTEM_NOTIFICATION",
      "CREATE_GLOBAL_INTERVAL",
      "CLEAR_GLOBAL_INTERVAL",
      "UPDATE_API_NOTIFICATIONS",
      "UPDATE_TEAM"
    ]),
    ...mapMutations("Tasks", ["UPDATE_BOARDS"]),
    ...mapMutations("Events", ["UPDATE_EVENT_TEMPLATES", "UPDATE_EVENTS"]),
    ...mapMutations("Requests", ["UPDATE_REQUESTS"]),

    getEvents(params = {}) {
      return new Promise((resolve, reject) => {
        const payload = {
          method: "GET",
          url: "events/all",
          params
        };
        this.request(payload)
          .then(response => {
            this.UPDATE_EVENTS(response);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getRequests(userID) {
      let _id = this.userInformation._id;
      return new Promise((resolve, reject) => {
        if (userID) {
          _id = userID;
        }
        const payload = {
          method: "GET",
          url: "events/requests/all",
          params: { _id }
        };
        this.request(payload)
          .then(response => {
            if (!userID) {
              this.UPDATE_REQUESTS(response);
              resolve();
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getEventTemplates() {
      return new Promise((resolve, reject) => {
        this.request({
          method: "GET",
          url: "events/templates"
        })
          .then(response => {
            this.UPDATE_EVENT_TEMPLATES(response);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      });
    },
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
.inner_common_container {
  display: flex;
  flex: 1;
  height: calc(100% - 100px);
  background: rgb(251, 251, 251);
}
</style>
