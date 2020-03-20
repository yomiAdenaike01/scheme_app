<template>
  <el-menu
    id="main_nav"
    :default-active="$route.path"
    :router="true"
    mode="vertical"
    :collapse="true"
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
      isCollapse: true
    };
  },
  computed: {
    ...mapState(["clientInformation", "localSettings"]),
    ...mapGetters(["getDefaultColour", "getIsSignedUser"]),

    routes() {
      let allowedRoutes = [
        {
          name: "Events management",
          path: "/admin/events",
          icon: "el-icon-date"
        },
        {
          name: "Messenger",
          path: "/admin/messenger",
          icon: "bx bx-conversation"
        },
        {
          name: "User management",
          path: "/admin/user",
          icon: "bx bx-group"
        }
      ];

      return allowedRoutes;
    },

    darken() {
      let base = tinycolor(this.getDefaultColour);
      return base.darken(40).toString();
    },

    lightColour() {
      let baseColour = tinycolor(this.getDefaultColour);
      if (baseColour.isLight()) {
        return baseColour.darken(50).toString();
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
  color: darken($color: white, $amount: 30);
}

#main_nav {
  flex: 1;
  height: 100%;
}
</style>
