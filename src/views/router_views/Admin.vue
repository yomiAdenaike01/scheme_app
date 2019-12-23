<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Admin',
  data() {
    return {
      adminInterval: null
    }
  },
  deactivated() {
    clearInterval(this.adminInterval)
  },
  activated() {
    this.adminInterval = setInterval(() => {
      this.getTeam()
      this.getNotifications()
    }, 5000)
  },
  methods: {
    ...mapActions('Admin', ['getTeam']),
    ...mapActions(['getNotifications'])
  }
}
</script>

<style></style>
