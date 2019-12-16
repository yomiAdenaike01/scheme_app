<template>
  <el-table :data="tableData" border>
    <el-table-column>
      <template slot-scope="scope">
        <ScheduleTableUnit :data="scope.row" />
      </template>
    </el-table-column>
    <el-table-column></el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "ScheduleTable",
  props: {
    tableData: Array
  },
  components: {
    ScheduleTableUnit: () => import("./ScheduleTableUnit")
  }
};
</script>

<style>
</style>