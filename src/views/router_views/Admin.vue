<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'Admin',
  data() {
    return {
      adminInterval: null
    }
  },
  computed: {
    ...mapState(['localSettings', 'userNotifications', 'currentUser'])
  },
  deactivated() {
    clearInterval(this.adminInterval)
  },
  activated() {
    let isVerified = this.currentUser.verified
    if (!isVerified) {
      this.UPDATE_NOTIFICATIONS({
        title: 'Activate account',
        type: 'info',
        message: 'Open settings to activate account.'
      })
    }
    let general = this.localSettings.general
    if (Notification.permission != 'granted') {
      this.requestNotificationPermission()
    }
    this.genNotifications()
    // Starting interval
    this.adminInterval = setInterval(() => {
      this.getTeam()
      this.getNotifications()
      this.getShifts()
    }, 5000)
  },
  methods: {
    ...mapActions('Admin', ['getTeam', 'getShifts']),
    ...mapActions(['getNotifications', 'request']),
    ...mapMutations(['UPDATE_NOTIFICATIONS']),

    genNotifications() {
      let notifications = this.userNotifications
      let len = notifications.length
      for (let i = 0; i < len; i++) {
        const notification = notifications[i]
        new Notification(notification.message)
      }
    },
    requestNotificationPermission() {
      if (!window.Notification) {
        console.log('Browser does not support notifications.')
      } else {
        Notification.requestPermission()
          .then(p => {
            if (p === 'granted') {
              // show notification here
            } else {
              console.log('User blocked notifications.')
            }
          })
          .catch(function(err) {
            console.error(err)
          })
      }
    }
  }
}
</script>

<style></style>
