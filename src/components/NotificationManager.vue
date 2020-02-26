<template>
  <div v-loading="loading" class="notifications_container overflow">
    <div class="title_switch_container p-3 flex align-center">
      <h3 class="bold">Notifications</h3>
      <el-switch v-model="dnd" active-text="Do not disturb"></el-switch>
    </div>
    <div v-if="hasEntries(userNotifications)">
      <Notification
        v-for="notification in userNotifications"
        :key="notification._id"
        :notification="notification"
      />
      <el-button
        class="block_button m-0"
        @click="readAll"
        size="small"
        v-if="hasEntries(getUserNotificationsLength)"
      >Mark all as read</el-button>
      <el-button
        v-if="hasReadNotifications"
        class="m-0 block_button"
        size="small"
        type="primary"
        plain
        @click="deleteReadNotifications"
      >Delete all read notifications</el-button>
    </div>
    <Nocontent v-else v-bind="noContent" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import Notification from "./Notification";
import Nocontent from "@/components/Nocontent";

export default {
  name: "NotificationManager",
  data() {
    return {
      loading: false,
      dnd: false
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
    ...mapGetters(["getUserNotificationsLength"]),
    hasReadNotifications() {
      return (
        this.userNotifications.filter(x => x.status == "is_read").length > 0
      );
    },
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
    deleteReadNotifications() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "notifications/delete/read"
      })
        .then(response => {
          this.loading = false;

          return response;
        })
        .catch(err => {
          this.loading = false;

          return err;
        });
    },
    readAll() {
      this.loading = true;
      this.request({
        method: "POST",
        url: "/notifications/read/all"
      })
        .then(response => {})
        .catch(error => {});
      this.loading = false;
    }
  },
  components: {
    Notification,
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.notifications_container {
  position: relative;
  height: 400px;
}
.title_switch_container {
  display: flex;
  justify-content: space-between;
  border-bottom: $border;
}
.block_button {
  width: 100%;
}
</style>
