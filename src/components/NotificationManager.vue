<template>
  <div v-loading="loading">
    <div v-if="userNotifications.length > 0">
      <Notification
        v-for="notification in userNotifications"
        :key="notification._id"
        :notification="notification"
      />
      <el-button
        class="block_button"
        type="text"
        @click="clearAllNotifications"
        size="small"
      >Mark all as read</el-button>
    </div>
    <Nocontent v-else v-bind="noContent" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Notification from "./Notification";
import Nocontent from "@/components/Nocontent";

export default {
  name: "NotificationManager",
  data() {
    return {
      loading: false
    };
  },
  activated() {
    this.getNotifications()
      .then(response => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },

  computed: {
    ...mapState(["userNotifications", "userInformation"]),
    noContent() {
      return {
        moreInformation: {
          index: "admin",
          instruction: "requests"
        },
        text:
          "No notifications present. Usually your notifications and requests will be displayed here",
        icon: "el-icon-bell"
      };
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["getNotifications"]),
    ...mapMutations(["UPDATE_USER_NOTIFICATIONS"]),
    clearAllNotifications() {
      this.globalLoader = true;
      this.request({
        method: "DELETE",
        url: "/notifications/all"
      })
        .then(response => {})
        .catch(error => {});
      this.globalLoader = false;
    }
  },
  components: {
    Notification,
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.block_button {
  width: 100%;
}
</style>
