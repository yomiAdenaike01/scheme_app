<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Comms',
  data() {
    return {
      commsInterval: null
    }
  },
  deactivated() {
    clearInterval(this.commsInterval)
  },
  activated() {
    this.commsInterval = setInterval(() => {
      this.getTranscripts()
      this.getTeam()
      this.getNotifications()
    }, 5000)
  },
  methods: {
    ...mapActions('Comms', ['getTranscripts']),
    ...mapActions('Admin', ['getTeam']),
    ...mapActions(['getNotifications'])
  }
}
</script>

<style></style>
