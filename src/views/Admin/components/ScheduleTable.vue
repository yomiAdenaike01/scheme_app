<template>
  <el-table :data="team" border v-loading="team.length <= 0">
    <el-table-column>
      <template slot-scope="scope">
        <ScheduleTableUnit :data="scope.row" />
      </template>
    </el-table-column>
    <el-table-column></el-table-column>
  </el-table>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ScheduleTable',
  computed: {
    ...mapState('Admin', ['team'])
  },
  components: {
    ScheduleTableUnit: () => import('./ScheduleTableUnit')
  }
}
</script>

<style></style>
