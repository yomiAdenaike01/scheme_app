<template>
  <el-drawer :visible-sync="returnDisplay">
    {{ getUserData }}
  </el-drawer>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ScheduleProfileView',
  props: {
    display: Boolean
  },
  computed: {
    ...mapState('Admin', ['viewUser']),
    ...mapGetters('Admin', ['getTeam']),
    getUserData() {
      return this.getTeam.find(member => {
        return (member._id = this.viewUser)
      })
    },
    returnDisplay: {
      get() {
        return this.display
      },
      set(val) {
        this.$emit('toggle', val)
      }
    }
  }
}
</script>

<style></style>
