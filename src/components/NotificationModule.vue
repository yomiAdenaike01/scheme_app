<template>
  <div v-loading="loading" class="notifications_container ">
    <div class="title_switch_container ">
      <h3 class="bold">Notifications</h3>
    </div>
    <div v-if="hasEntries(userNotifications)">
      <UserNotification
        v-for="notification in userNotifications"
        :key="notification._id"
        :notification="notification"
      />
      <el-button
        v-if="getUserNotificationsLength > 0"
        class="block_button m-0"
        size="small"
        @click="readAll"
        >Mark all as read</el-button
      >
    </div>
    <InformationDisplay
      v-else
      class="mt-5"
      :display-text="{
        tag: 'h3',
        heading: 'No notifications found',
        content: 'Your notifications will appear here once they have come in.'
      }"
    >
      <i slot="header" class="bx bx-bell flex_center mt-4 mb-4"></i>
    </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import UserNotification from "./UserNotification";
import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "NotificationModule",
  components: {
    UserNotification,
    InformationDisplay
  },
  data() {
    return {
      loading: false
    };
  },
  activated() {
    this.getNotifications()
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
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
  height: 400px;
  position: relative;
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
