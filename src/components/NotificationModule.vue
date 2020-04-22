<template>
  <div v-loading="loading" class="notifications_container">
    <div class="title_switch_container ">
      <h3 class="bold">Notifications</h3>
    </div>
    <div v-if="userNotifications.length > 0" class="notification_wrapper">
      <UserNotification
        v-for="(notification, index) in userNotifications"
        :key="notification._id"
        :notification="notification"
        @click="notificationController(notification, index)"
      />
      <div v-if="userNotifications.length > 0" class="mark_all_wrapper">
        <el-button class="block_button" size="small" @click="readAll"
          >Mark all as read</el-button
        >
      </div>
    </div>
    <InformationDisplay
      v-else
      :display-text="{
        tag: 'h3',
        hasIcon: true,
        heading: 'No notifications found',
        content: 'Your notifications will appear here once they have come in.'
      }"
    >
      <i slot="header" class="bx bx-bell"></i>
    </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import notificationLogic from "@/mixins/notificationsLogic";
export default {
  name: "NotificationModule",
  components: {
    UserNotification: () => import("./UserNotification"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  mixins: [notificationLogic],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["userNotifications", "userInformation", "notificationRef"]),
    formattedNotifications() {
      return [...this.userNotifications].map(notification => {
        return this.notificationLogic(notification);
      });
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["getNotifications"]),
    ...mapMutations([
      "UPDATE_ALL_NOTIFICATIONS",
      "UPDATE_NOTIFICATION",
      "DELETE_NOTIFICATION"
    ]),
    notificationController(notification, notificationIndex) {
      // Read notification
      this.UPDATE_NOTIFICATION({
        notificationIndex,
        update: { ...notification, status: "read" }
      });
      this.request({
        method: "POST",
        data: { _id: notification._id, update: { status: "read" } },
        url: "notifications/update"
      }).catch(() => {
        this.UPDATE_NOTIFICATION(this.notificationRef);
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
.el-popover .el-popper {
  padding: 0;
}
.notifications_container {
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
.title_switch_container {
  border-bottom: $border;
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding: 10px;
}
.block_button {
  width: 100%;
}
</style>
