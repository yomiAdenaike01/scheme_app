<template>
  <el-menu
    id="main_nav"
    style="height:100%"
    :default-active="$route.path"
    :router="true"
    mode="vertical"
  >
    <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">
      <i :class="route.icon"></i>

      <span slot="title">{{route.name}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      isCollapse: true,
      routes: [
        {
          name: "Dashboard",
          path: "/dashboard",
          icon: "el-icon-s-data"
        },
        {
          name: "Schedule",
          path: "/schedule",
          icon: "el-icon-time"
        },
        {
          name: "Reports",
          path: "/reports",
          icon: "el-icon-notebook-1"
        },
        {
          name: "Messenger",
          path: "/messenger",
          icon: "el-icon-chat-round"
        }
      ]
    };
  }
};
</script>

<style>
</style>