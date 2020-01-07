<template>
  <div class="main_wrapper">
    <AppBar />
    <el-row type="flex" style="height:100%">
      <el-col style="flex:1">
        <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
      </el-col>
      <el-col>
        <router-view></router-view>
      </el-col>
    </el-row>
    <NotificationsCenter />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import AppBar from "@/components/AppBar";
import Navigation from "@/components/Navigation";
import NotificationsCenter from "@/components/NotificationsCenter";
export default {
  name: "Main",
  computed: {
    ...mapState([
      "notifications",
      "globalLoader",
      "currentUser",
      "userNotifications",
      "viewMobileMenu",
      "defaultSize",
      "critical_network_error"
    ])
  },

  methods: {
    ...mapMutations(["REMOVE_USER"]),
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
    NotificationsCenter
  },
  watch: {
    critical_network_error: {
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
