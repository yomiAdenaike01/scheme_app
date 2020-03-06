<template>
  <el-menu
    id="main_nav"
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
          name: "Events management",
          path: "/admin/events",
          icon: "el-icon-date"
        },
        // {
        //   name: "Messenger",
        //   path: "/comms/messenger",
        //   icon: "bx bx-message-rounded-edit"
        // },
        {
          name: "User management",
          path: "/admin/user",
          icon: "bx bx-group"
        },
        // {
        //   name: "Analytics",
        //   path: "/admin/analytics",
        //   icon: "bx bx-bar-chart-alt-2"
        // },
        // {
        //   name: "Utilities",
        //   path: "/admin/utilities",
        //   icon: "bx bx-task"
        // },
        {
          name: "Support",
          path: "/support/dashboard",
          icon: "bx bx-support"
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

#main_nav {
  flex: 1;
  height: 100%;
}
</style>
