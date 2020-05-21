<template>
  <div v-loading="loading" class="notifications_container">
    <h3 class="bold">Notifications</h3>
    <div v-if="apiNotifications.length > 0" class="notification_wrapper">
      <Notification
        v-for="(notification, index) in apiNotifications"
        :key="notification._id"
        :notification="notification"
        @click="notificationController(notification, index)"
      />
      <div v-if="apiNotifications.length > 0" class="mark_all_wrapper">
        <el-button class="block_button" size="small" @click="readAll"
          >Mark all as read</el-button
        >
      </div>
    </div>
    <div v-else class="text_container all_centre">
      <i class="bx bx-bell"></i>
      <h3>No notifications found</h3>
      <p>Your notifications will appear here once they have come in</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import Notification from "./components/Notification";

export default {
  name: "Notifications",
  components: {
    Notification
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["apiNotifications", "userInformation", "notificationRef"]),
    formattedNotifications() {
      return [...this.apiNotifications].map(notification => {
        return notification;
      });
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations([
      "UPDATE_ALL_NOTIFICATIONS",
      "UPDATE_SYSTEM_NOTIFICATION",
      "UPDATE_API_NOTIFICATION"
    ]),
    notificationController(notification, notificationIndex) {
      // Read notification
      this.UPDATE_API_NOTIFICATION({
        update: { ...notification, status: "read" }
      });
      this.request({
        method: "POST",
        data: { _id: notification._id, update: { status: "read" } },
        url: "notifications/update"
      });
    },
    deleteReadNotifications() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "notifications/delete/read"
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    readAll() {
      this.UPDATE_ALL_NOTIFICATIONS({ status: "read" });
      this.request({
        method: "POST",
        url: "/notifications/read/all"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.notifications_container {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 400px;
}
.notification_wrapper {
  max-height: calc(100% - 75px);
  overflow-x: hidden;
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
