<template>
  <el-drawer :visible-sync="returnDisplay">
    {{ getUserData }}
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'ScheduleProfileView',
  props: {
    display: Boolean
  },
  computed: {
    ...mapState('Admin', ['viewUser', 'team']),
    getUserData() {
      return this.team.find(member => {
        return (member.email = this.viewUser)
      })
    },
    returnDisplay: {
      get() {
        return this.viewUser.length > 0
      },
      set(val) {
        this.UPDATE_VIEW_USER(null)
      }
    }
  },
  methods: {
    ...mapMutations('Admin', ['UPDATE_VIEW_USER'])
  }
}
</script>

<style></style>
