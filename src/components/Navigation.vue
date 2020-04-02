<template>
  <el-menu
    class="main_nav"
    :default-active="$route.path"
    :router="true"
    mode="vertical"
    background-color="#545c64"
    :collapse="true"
    :active-text-color="lightColour"
  >
    <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
      <i :class="route.icon" class="home_icon"></i>
      <small slot="title" class="m-2">{{ route.name }}</small>
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
    ...mapGetters(["getDefaultColour", "getIsAdmin"]),

    routes() {
      let allowedRoutes = [
        {
          name: "Events management",
          path: "/admin/events",
          icon: "el-icon-date"
        },
        {
          name: "Task management",
          path: "/admin/tasks",
          icon: "bx bx-task"
        },
        {
          name: "Messenger",
          path: "/admin/messenger",
          icon: "bx bx-message"
        }
      ];
      if (this.getIsAdmin) {
        allowedRoutes.push({
          name: "User management",
          path: "/admin/user",
          icon: "bx bx-group"
        });
      }
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

.main_nav {
  height: 100%;
}
</style>
