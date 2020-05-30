<template>
  <div v-loading="loading" class="notifications_container">
    <div v-if="apiNotifications.length > 0" class="notifications">
      <!-- Display read notifications header -->
      <div
        class="display_read_notifications_conatiner trigger"
        @click="displayRead = !displayRead"
      >
        <span>Toggle {{ displayRead ? "all" : "unread" }} notifications</span>
        <!-- Checkbox -->
      </div>
      <!-- Categories -->
      <div v-for="(category, key) in categorisedNotifications" :key="key">
        <div class="category">
          <div v-if="category.length > 0">
            <div class="category_header">
              <span class="grey">{{ categoryLangXref[key] }}</span>
            </div>
            <!-- Each notification -->
            <slide-x-left-transition mode="out-in" group>
              <div
                v-for="(notification, index) in category"
                :key="notification._id"
                :class="[
                  `notification trigger ${notification.type}`,
                  { read: notification.status == 'read' }
                ]"
                @click="handleNotification($event, notification, index)"
              >
                <!-- Close icon -->
                <i
                  class="bx bx-x trigger close_icon grey"
                  @click="deleteNotification($event, notification._id, index)"
                ></i>
                <!-- Notification body -->
                <div class="notification_body">
                  <i
                    :class="`bx ${iconXref[notification.type]} action_icon`"
                  ></i>
                  <div class="notification_body_container">
                    <p>{{ notification.message }}</p>
                    <small class="grey">{{
                      initMoment(notification.date_created).calendar()
                    }}</small>
                  </div>

                  <small
                    v-if="notification.status == 'read'"
                    class="read_container"
                    >Read</small
                  >
                </div>
              </div>
            </slide-x-left-transition>
          </div>
        </div>
      </div>
    </div>
    <!-- No notifications -->
    <div v-else class="text_container all_centre">
      <i class="bx bx-bell"></i>
      <h3>No notifications found</h3>
      <p>Your notifications will appear here.</p>
    </div>
    <div
      v-if="apiNotifications.length > 0"
      class="delete_notifications_controller trigger"
      @click="handleDelete"
    >
      <span class="grey"
        >delete {{ displayRead ? "all" : "read" }} notifications</span
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import Notification from "./components/Notification";
import { SlideXLeftTransition } from "vue2-transitions";

export default {
  name: "Notifications",
  components: {
    Notification,
    SlideXLeftTransition
  },
  data() {
    return {
      loading: false,
      displayRead: true
    };
  },
  computed: {
    ...mapState([
      "apiNotifications",
      "userInformation",
      "notificationRef",
      "iconXref"
    ]),
    ...mapState("Events", ["events"]),
    ...mapState("Comms", ["chats"]),
    ...mapState("Requests", ["requests"]),

    categoryLangXref() {
      return {
        message: "messages",
        event: "events",
        request: "requests"
      };
    },
    categorisedNotifications() {
      let notifications = {
        message: [],
        request: [],
        event: []
      };
      for (let i = 0, len = this.apiNotifications.length; i < len; i++) {
        let notification = this.apiNotifications[i];
        if (!this.displayRead && notification.status == "read") {
          continue;
        } else {
          notifications[notification.type].push(notification);
        }
      }

      return notifications;
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations([
      "UPDATE_OVERLAY_INDEX",
      "DELETE_API_NOTIFICATION",
      "UPDATE_API_NOTIFICATION",
      "CREATE_SYSTEM_NOTIFICATION",
      "DELETE_ALL_API_NOTIFICATIONS"
    ]),
    handleDelete(e) {
      e.stopPropagation();

      if (this.displayRead) {
        this.deleteAll();
      } else {
        this.deleteRead();
      }
    },
    deleteLocalNotifications(cb) {
      for (let i = 0, len = this.apiNotifications.length; i < len; i++) {
        if (cb(this.apiNotifications[i])) {
          this.DELETE_API_NOTIFICATION(i);
        }
      }
    },
    async deleteRead() {
      try {
        let apiPayload = {
          method: "DELETE",
          url: "notifications/delete/read"
        };

        this.deleteLocalNotifications(notification => {
          return notification.status == "read";
        });

        await this.request(apiPayload);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteAll() {
      try {
        let apiPayload = {
          method: "DELETE",
          url: "notifications/delete/all"
        };

        this.DELETE_ALL_API_NOTIFICATIONS();

        await this.request(apiPayload);
      } catch (error) {
        console.error(error);
      }
    },
    updateRoute(route) {
      if (this.$route.name != route.name) {
        this.$router.push(route);
      }
    },
    handleMessage(notification) {
      let payload = notification.payload;
      let chatExists = this.chats.findIndex(x => x._id == payload.chat_id) > -1;

      if (chatExists) {
        this.updateRoute({
          name: "comms",
          params: {
            chat_id: payload.chat_id
          }
        });
      } else {
        this.sysNotify("Chat", "chat");
      }
      // Route to chat and message
    },
    handleRequest(notification) {
      let requestPayload = notification.payload.request_id;
      let requestExists =
        this.requests.findIndex(x => x._id == requestPayload) > -1;
      if (requestExists) {
        this.updateRoute({
          name: "requests",
          params: {
            view: "requests",
            teamMember: notification.sent_from._id
          }
        });
      } else {
        this.sysNotify("Request", "request");
      }
    },
    handleEvent(notification) {
      // check event exists
      let eventIndex = this.events.findIndex(x => {
        return x._id == notification.payload.event_id;
      });

      // go to route and display overlay
      if (eventIndex > -1) {
        this.updateRoute({
          name: "events"
        });

        this.UPDATE_OVERLAY_INDEX({
          overlay: "viewEvent",
          display: true,
          payload: this.events[eventIndex]
        });
      } else {
        this.sysNotify("Event", "requested event");
      }
    },
    sysNotify(title, message) {
      // abstract notification
      this.CREATE_SYSTEM_NOTIFICATION({
        title: `${title} not found`,
        message: `Your ${message} could not be found it may have been deleted`
      });
    },
    handleNotification(e, notification, index) {
      e.stopPropagation();
      if (notification?.payload) {
        let type = notification.type;

        switch (type) {
          case "message": {
            this.handleMessage(notification);
            break;
          }

          case "request": {
            this.handleRequest(notification);
            break;
          }
          case "event": {
            this.handleEvent(notification);
            break;
          }
          default:
            break;
        }
      }

      // Read notification
      this.updateNotification(notification._id, index, {
        status: "read"
      });
    },
    async updateNotification(_id, index, update) {
      try {
        this.UPDATE_API_NOTIFICATION({ index, update });

        let apiPayload = {
          method: "PUT",
          url: "notifications/update",
          data: { _id, update }
        };

        await this.request(apiPayload);
      } catch (error) {
        this.UPDATE_API_NOTIFICATION(this.notificationRef);
      }
    },
    async deleteNotification(e, _id, index) {
      try {
        e.stopPropagation();
        this.DELETE_API_NOTIFICATION(index);
        let apiPayload = {
          method: "DELETE",
          url: "/notifications/delete",
          data: { _id }
        };
        await this.request(apiPayload);
      } catch (error) {
        console.warn(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.notifications_container {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 450px;
  max-height: 450px;
  position: relative;
}
.notifications {
  max-height: calc(100% - 75px);
  overflow-x: hidden;
}
.display_read_notifications_conatiner {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: $border;
}

.notification {
  border-bottom: $border;
  padding: 14px;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  position: relative;
  white-space: nowrap;
  p {
    margin: 0;
  }

  @include notificationLoop;
  &:hover {
    opacity: 1;
  }
}
.notification_body {
  display: flex;
  align-items: center;
}
.close_icon {
  display: flex;
  align-self: flex-end;
  font-size: 1.3em;
}
.mark_all_wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.block_button {
  width: 100%;
}
.text_container .bx {
  font-size: 2em;
  margin-bottom: 10px;
}
.text_container p {
  margin: 0;
}
.category_header {
  padding: 10px;
  text-transform: uppercase;
  border-bottom: $border;
}
.read_container {
  border-radius: 20px;
  color: white;
  background: rgb(210, 210, 210);
  text-transform: uppercase;
  margin-left: 40px;
  padding: 5px 10px;
  white-space: nowrap;
}
.delete_notifications_controller {
  background: rgb(252, 252, 252);
  padding: 10px;
  text-transform: capitalize;
  text-align: center;
}
</style>
