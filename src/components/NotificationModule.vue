<template>
  <div v-loading="loading" class="notifications_container overflow">
    <div class="title_switch_container p-3 flex align-center">
      <h3 class="bold">Notifications</h3>
      <el-switch v-model="dnd" active-text="Do not disturb"></el-switch>
    </div>
    <div v-if="userNotifications">
      <UserNotification
        v-for="notification in userNotifications"
        :key="notification._id"
        :notification="notification"
      />
      <el-button
        class="block_button m-0"
        @click="readAll"
        size="small"
        v-if="getUserNotificationsLength > 0"
        >Mark all as read</el-button
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import UserNotification from "./UserNotification";

export default {
  name: "NotificationModule",
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
  components: {
    UserNotification
  },
  computed: {
    ...mapState(["userNotifications", "userInformation"]),
    ...mapGetters(["getUserNotificationsLength"])
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Admin", ["getNotifications"]),
    deleteReadNotifications() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "notifications/delete/read"
      })
        .then(response => {
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    readAll() {
      this.loading = true;
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
