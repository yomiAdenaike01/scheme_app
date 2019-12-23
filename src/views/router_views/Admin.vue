<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Admin',
  created() {
    this.getTeam()
    this.getShifts()
  },
  methods: {
    ...mapActions('Admin', ['getTeam', 'getShifts'])
  }
}
</script>

<style></style>
