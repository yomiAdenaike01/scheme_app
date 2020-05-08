<template>
  <div
    v-loading="loading"
    element-loading-text="Loading events and team members...."
    class="common_container"
  >
    <NprogressContainer />
    <CommonBar />

    <ViewEventOverlay v-if="overlayIndex.viewEvent.view" />

    <div class="notification_container">
      <slide-x-right-transition group mode="out-in">
        <div
          v-for="(notification, notificationIndex) in systemNotifications"
          :key="notification._id"
          :class="['notification', notification.type]"
        >
          <div class="body_container">
            <div class="icon_container">
              <i :class="`bx bx-${notification.icon}`"></i>
            </div>
            <div class="text_container">
              <h4 class="title">
                {{ notification.title }}
              </h4>
              <p>{{ notification.message }}</p>
            </div>
          </div>
          <div class="functions_container">
            <div
              v-for="(method, index) in notification.methods"
              :key="index"
              class="function"
              @click="excecuteNotification(method, notificationIndex)"
            >
              <p>{{ method.label }}</p>
            </div>
          </div>
        </div>
      </slide-x-right-transition>
    </div>

    <div class="common_wrapper">
      <Menu />
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
import { SlideXLeftTransition, SlideXRightTransition } from "vue2-transitions";

import ViewEventOverlay from "./../events/components/ViewEventOverlay";

import CommonBar from "./components/CommonBar";
import Menu from "@/components/Menu";

import SButton from "@/components/SButton";

export default {
  name: "Common",
  components: {
    NprogressContainer,
    SlideXLeftTransition,
    SlideXRightTransition,
    ViewEventOverlay,

    CommonBar,
    Menu,
    SButton
  },
  data() {
    return {
      loading: true,
      display: true
    };
  },
  computed: {
    ...mapState([
      "userInformation",
      "apiNotifications",
      "systemNotifications",
      "globalIntervals",
      "overlayIndex"
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
      duration: this.globalIntervals.admin,
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
        icon: "shield-x",
        title: "Activate account",
        message: "Open settings to activate account.",
        methods: [
          {
            label: "Activate",
            body() {
              return new Promise((resolve, reject) => {
                this.UPDATE_USER({ verified: true });
                this.request({
                  method: "POST",
                  data: {
                    _id: this.userInformation._id,
                    update: { verified: false }
                  }
                })
                  .then(() => {
                    resolve();
                  })
                  .catch(err => {
                    reject(err);
                  });
              });
            }
          }
        ]
      });
    }

    if (window.Notification.permission != "granted") {
      // request notification permission
      window.Notification.requestPermission();
    }
  },

  methods: {
    ...mapActions(["request", "updateDevices", "closeOverlay"]),
    ...mapMutations([
      "CREATE_SYSTEM_NOTIFICATION",
      "DELETE_SYSTEM_NOTIFICATION",
      "CREATE_GLOBAL_INTERVAL",
      "DELETE_GLOBAL_INTERVAL",
      "UPDATE_API_NOTIFICATIONS",
      "UPDATE_USER"
    ]),
    ...mapMutations("Tasks", ["UPDATE_BOARDS"]),
    ...mapMutations("Team", ["UPDATE_TEAM"]),
    ...mapMutations("Events", ["UPDATE_EVENT_TEMPLATES", "UPDATE_EVENTS"]),
    ...mapMutations("Requests", ["UPDATE_REQUESTS"]),
    excecuteNotification(method, notificationIndex) {
      method.body()?.finally(() => {
        this.DELETE_SYSTEM_NOTIFICATION(notificationIndex);
      });
    },

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
/**
  Notifications
*/

.notification_container {
  position: fixed;
  top: 2%;
  right: 0;
  left: 85%;
  z-index: 999995;
}
.notification {
  background: white;
  box-shadow: $box_shadow;
  display: flex;
  min-width: 300px;
  max-width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  min-height: fit-content;
  border-left: 4px solid rgba(var(--colour_primary), 1);
  &.message,
  .icon_container {
    border-left-color: var(--colour_secondary);
    color: var(--colour_secondary);
  }
  &.warning {
    border-left-color: var(--colour_yellow);
    color: var(--colour_yellow);
  }
}
.notification .body_container {
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 20px;
  position: relative;
}
.notification .text_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  p {
    margin: 0;
    font-size: 0.9em;
  }
  h4 {
    margin: 0;
    font-weight: 500;
  }
}
.notification .icon_container {
  flex: 0.3;
  font-size: 2.3em;
  color: rgba(var(--colour_primary), 1);
}

.functions_container {
  display: flex;
  flex: 0.4;
  flex-direction: column;
  height: 100%;
  border-left: 2px solid rgb(240, 240, 240);

  .function {
    cursor: pointer;
    border-top: $border;
    text-align: center;
    text-transform: capitalize;
    &:first-of-type {
      border: none;
    }
    &:hover {
      background: rgb(250, 250, 250);
    }
  }
}
.common_wrapper {
  display: flex;
  flex: 1;
  height: calc(100% - 70px);
  background: rgb(251, 251, 251);
}
</style>
