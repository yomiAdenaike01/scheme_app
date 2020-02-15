<template>
  <el-menu
    id="main_nav"
    style="height:100%; border:none; z-index:3"
    :default-active="$route.path"
    :router="true"
    mode="vertical"
    :collapse="true"
    :background-color="getDefaultColour"
    :active-text-color="lightColour"
  >
    <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
      <i :class="route.icon" class="home_icon"></i>
      <small class="m-2" slot="title">{{ route.name }}</small>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState, mapGetters } from "vuex";
var tinycolor = require("tinycolor2");
export default {
  name: "Navigation",
  data() {
    return {
      isCollapse: true,
      routes: [
        {
          name: "Events",
          path: "/admin/events",
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
        },
        {
          name: "Reports",
          path: "/admin/reports",
          icon: "el-icon-notebook-1"
        },
        {
          name: "Utilities",
          path: "/admin/utilities",
          icon: "el-icon-s-opportunity"
        }
      ]
    };
  },
  computed: {
    ...mapState(["client", "localSettings"]),
    ...mapGetters(["getDefaultColour"]),

    lightColour() {
      let baseColour = tinycolor(this.getDefaultColour);
      if (baseColour.isLight()) {
        return baseColour.darken(10).toString();
      } else {
        return baseColour.lighten(40).toString();
      }
    }
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
