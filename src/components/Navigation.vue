<template>
  <el-menu :default-active="$route.path" :router="true" class="el-menu-demo" mode="horizontal">
    <el-menu-item v-for="route in routes" :key="route.path" :index="route.path">{{route.name}}</el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      routes: [
        {
          name: "Dashboard",
          path: "/dashboard"
        },
        {
          name: "Schedule",
          path: "/schedule"
        },
        {
          name: "Reports",
          path: "/reports"
        },
        {
          name: "Messenger",
          path: "/messenger"
        },
        {
          name: "Staff",
          path: "/staff"
        }
      ]
    };
  }
};
</script>

<style>
</style>