<template>
  <el-menu
    id="main_nav"
    style="height:100%"
    :default-active="$route.path"
    :router="true"
    mode="vertical"
    :collapse="true"
    background-color="#0d243f"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
      <i :class="route.icon" class="home_icon"></i>
      <span slot="title">{{ route.name }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Navigation",
  data() {
    return {
      isCollapse: true,
      routes: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: "el-icon-s-data"
        },
        {
          name: "Schedule",
          path: "/admin/schedule",
          icon: "el-icon-time"
        },
        {
          name: "Messenger",
          path: "/comms/messenger",
          icon: "el-icon-chat-round"
        }
      ]
    };
  },
  computed: {
    ...mapState(["client"])
  }
};
</script>

<style lang="scss" scoped>
.home_icon {
  font-size: 1.5em;
}
</style>
