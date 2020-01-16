<template>
  <el-menu
    id="main_nav"
    style="height:100%"
    :default-active="$route.path"
    :router="true"
    mode="vertical"
    :collapse="true"
    text-color="#fff"
    :background-color="colours"
    :active-text-color="lightColour"
  >
    <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
      <i :class="route.icon" class="home_icon"></i>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
var tinycolor = require("tinycolor2");
export default {
  name: "Navigation",
  data() {
    return {
      isCollapse: true,
      colours: "#0d243f",
      routes: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: "el-icon-s-data"
        },
        {
          name: "Schedule",
          path: "/admin/schedule",
          icon: "el-icon-date"
        },
        {
          name: "Messenger",
          path: "/comms/messenger",
          icon: "el-icon-chat-round"
        },
        {
          name: "User",
          path: "/admin/user",
          icon: "el-icon-user"
        }
      ]
    };
  },
  computed: {
    ...mapState(["client", "localSettings"]),
    lightColour() {
      let baseColour = tinycolor(this.colours);
      return baseColour.lighten(50).toString();
    }
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "UPDATE_COLOURS") {
        let { colours } = state.localSettings;
        console.log(colours.sidebar);
        this.colours = colours.sidebar;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.home_icon {
  font-size: 1.5em;
}
.el-menu-item {
  width: 100%;
}
.el-menu-item i {
  color: darken($color: white, $amount: 10);
}
</style>
