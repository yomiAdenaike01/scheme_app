<template>
  <div class="main_wrapper">
    <AppBar />
    <el-row type="flex" style="height:100%">
      <el-col style="flex:1">
        <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
      </el-col>
      <el-col>
        <!-- Server health -->
        <ServerHealth />
        <!-- Router view -->
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
    <NotificationsCenter />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import AppBar from "@/components/AppBar";
import Navigation from "@/components/Navigation";
import NotificationsCenter from "@/components/NotificationsCenter";
import moment, * as moments from "moment";
import ServerHealth from "@/components/ServerHealth";
import CriticalError from "@/components/CriticalError";
import InvalidClient from "@/components/InvalidClient";

export default {
  name: "Main",

  activated() {
    this.checkServerHealth();

    let isVerified = this.currentUser.verified;
    if (!isVerified) {
      this.UPDATE_NOTIFICATIONS({
        title: "Activate account",
        type: "info",
        message: "Open settings to activate account."
      });
    }
    let general = this.localSettings.general;
    if (Notification.permission != "granted") {
      this.requestNotificationPermission();
    }

    this.displayWeeklyTimesheetNotification();
    this.checkIsLocumnWorking();
  },
  computed: {
    ...mapState([
      "notifications",
      "globalLoader",
      "currentUser",
      "userNotifications",
      "viewMobileMenu",
      "defaultSize",
      "criticalNetworkError",
      "weeklyTimesheetUploaded",
      "localSettings"
    ]),
    ...mapState("Admin", ["shifts", "team"]),
    returnIsStartOfWeek() {
      return moment().get("day") <= 1;
    }
  },

  methods: {
    ...mapActions(["checkServerHealth"]),
    ...mapMutations([
      "REMOVE_USER",
      "UPDATE_NOTIFICATIONS",
      "UPDATE_VIEW_NOTIFICATIONS_CENTER"
    ]),

    requestNotificationPermission() {
      if (!window.Notification) {
        console.log("Browser does not support notifications.");
      } else {
        Notification.requestPermission()
          .then(p => {
            if (p === "granted") {
              // show notification here
            } else {
              console.log("User blocked notifications.");
            }
          })
          .catch(function(err) {
            console.error(err);
          });
      }
    },

    checkIsLocumnWorking() {
      this.shifts.all.map(shift => {
        // Is Today
        let shiftStartTime = shift.startDate;
        let type = shift.type;
        if (
          shiftStartTime == moment(shiftStartTime).isSame(new Date(), "day")
        ) {
          if (type == 2) {
            this.UPDATE_NOTIFICATIONS({
              title: "No locumn shift detected.",
              message: "Please go to schedule to book a new locumn shift.",
              type: "warning",
              onClick: () => {
                this.$router.push({ name: "schedule" });
              }
            });
          }
        }
      });
    },
    /**
     * Create notification at the start of the week asking them to upload a timesheet
     */
    displayWeeklyTimesheetNotification() {
      if (!this.weeklyTimesheetUploaded && this.returnIsStartOfWeek)
        this.UPDATE_NOTIFICATIONS({
          type: "info",
          message: "Start the new week off by uploading a new weekly timesheet",
          title: "Upload Timesheet"
        });
    },
    displayRedirectBox() {
      // Redirect to login;
      let msg = "A critical network error has occured.",
        title = "Critical Error!";

      this.$confirm(msg, title, {
        confirmButtonText: "Log out",
        type: "error"
      }).then(() => {
        this.REMOVE_USER();
        this.$router.push({ name: "login" });
      });
    }
  },
  components: {
    Navigation,
    AppBar,
    NotificationsCenter,
    ServerHealth
  },
  watch: {
    criticalNetworkError: {
      immediate: true,
      handler(val) {
        if (val) {
          this.displayRedirectBox();
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main_wrapper {
  height: 100%;
}
</style>
