<template>
  <div v-loading="globalLoader">
    <el-drawer :visible.sync="viewNotifications" :direction="this.settings.drawer">
      <Title title="Notifications centre" subtitle="View and interact will notifications here." />
      <transition name="el-fade-in">
        <el-row v-if="userNotifications.length > 0">
          <el-button
            style="width:100%"
            @click="clearAllNotifications"
            size="small"
            type="danger"
          >Clear Notifications</el-button>

          <el-col v-for="notification in userNotifications" :key="notification._id">
            <Notification :notification="notification" />
          </el-col>
        </el-row>
      </transition>
      <el-container
        v-if="userNotifications.length <= 0"
        style="background:rgb(250,250,250); height:100%;"
      >
        <el-main style="display:flex; align-items:center; justify-content:center">
          <i class="el-icon-bell"></i>
          <h1 class="grey light">No notifications found.</h1>
        </el-main>
      </el-container>
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Notification from "./Notification";
import Title from "@/components/Title";
import responsive from "@/mixins/responsiveProperties";
export default {
  name: "NotificationsCenter",
  data() {
    return {
      globalLoader: false
    };
  },
  computed: {
    ...mapState([
      "viewNotificationsCenter",
      "userNotifications",
      "currentUser"
    ]),
    viewNotifications: {
      get() {
        return this.viewNotificationsCenter;
      },
      set(val) {
        this.UPDATE_VIEW_NOTIFICATIONS_CENTER(val);
      }
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_VIEW_NOTIFICATIONS_CENTER"]),
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
    Title
  },
  mixins: [responsive]
};
</script>

<style lang="scss" scoped></style>
