<template>
  <div v-loading="loading" class="notifications_container">
    <div v-if="apiNotifications.length > 0" class="notifications">
      <!-- Api notifications -->
      <slide-x-left-transition mode="out-in" group>
        <div
          v-for="(notification, index) in apiNotifications"
          :key="notification._id"
          :class="`notification trigger ${notification.type}`"
          @click="handleNotification(notification, index)"
        >
          <i :class="`bx ${iconXref(notification.type)} action_icon`"></i>
          <div class="notification_body_container">
            <p>{{ notification.message }}</p>
            <small class="grey">{{
              initMoment(notification.date_created).calendar()
            }}</small>
            <i
              class="bx bx-x trigger close_icon grey"
              @click="deleteNotification(notification._id, index)"
            ></i>
          </div>
        </div>
      </slide-x-left-transition>
    </div>
    <div v-else class="text_container all_centre">
      <i class="bx bx-bell"></i>
      <h3>No notifications found</h3>
      <p>Your notifications will appear here.</p>
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
      loading: false
    };
  },
  computed: {
    ...mapState(["apiNotifications", "userInformation", "notificationRef"])
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["DELETE_API_NOTIFICATION"]),
    updateRoute(route) {
      if (this.$route.name == route.name) {
        this.$router.push(route);
      }
    },
    handleMessage(notification) {
      let data = notification.data;
      // Route to chat and message
      this.updateRoute({
        name: "comms",
        params: {
          chat_id: data
        }
      });
    },
    handleRequest(notification) {
      this.updateRoute({
        name: "events",
        params: {
          view: "requests",
          teamMember: notification.sent_from._id
        }
      });
    },
    handleNotification(notification, index) {
      if (notification?.data) {
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
    async deleteNotification(_id, index) {
      try {
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
    },

    iconXref(type) {
      let ref = {
        message: "bxl-discourse",
        request: "bx-question-mark"
      };
      return ref[type];
    }
  }
};
</script>

<style lang="scss" scoped>
$notification_ref: (
  message: var(--colour_secondary),
  request: var(--purple)
);
.notifications_container {
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 450px;
  max-height: 450px;
}
.notifications {
  max-height: calc(100% - 75px);
  overflow-x: hidden;
}
.notification {
  border-bottom: $border;
  padding: 14px;
  opacity: 0.8;
  display: flex;
  align-items: center;
  position: relative;
  p {
    margin: 0;
  }

  @each $key, $value in $notification_ref {
    &.#{$key} {
      border-left: 3px solid rgba($value, 1);
      .action_icon {
        color: rgba($value, 1);
        margin-right: 20px;
        font-size: 1.7em;
      }
    }
  }
  &:hover {
    opacity: 1;
  }
}
.close_icon {
  position: absolute;
  right: 10px;
  top: 10px;
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
</style>
