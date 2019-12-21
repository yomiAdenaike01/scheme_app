<template>
  <el-row type="flex">
    <el-col v-for="(tab,index) in tabs" :key="index" style="flex:0.2">
      <div v-html="tab.slot"></div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "DashboardTabs",
  props: {
    tabs: Array
  }
};
</script>

<style>
</style>