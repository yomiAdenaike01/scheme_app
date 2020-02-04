<template>
  <div v-loading="globalLoader">
    <el-drawer :visible.sync="viewNotifications" :direction="this.settings.drawer">
      <slide-x-left-transition>
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
      </slide-x-left-transition>
      <Nocontent v-bind="noContent" />
    </el-drawer>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import Notification from "./Notification";
import Title from "@/components/Title";
import responsive from "@/mixins/responsiveProperties";
import Nocontent from "@/components/Nocontent";
import { SlideXLeftTransition } from "vue2-transitions";

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
      "userInformation"
    ]),
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
    },
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
    Title,
    Nocontent,
    SlideXLeftTransition
  },
  mixins: [responsive]
};
</script>

<style lang="scss" scoped></style>
