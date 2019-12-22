<template>
  <el-table :data="shifts" border v-loading="shifts.length <= 0">
    <el-table-column>
      <template slot-scope="scope">
        <TableEmployee :data="scope.row" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ScheduleTable',
  computed: {
    ...mapState('Admin', ['shifts'])
  },
  components: {
    TableEmployee: () => import('./TableEmployee')
  }
}
</script>

<style></style>
