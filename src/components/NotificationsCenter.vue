<template>
  <el-drawer :visible.sync="viewNotifications">
    {{ notifications }}
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'NotificationsCenter',
  computed: {
    ...mapState(['viewNotificationsCenter', 'notifications']),
    viewNotifications: {
      get() {
        return this.viewNotificationsCenter
      },
      set(val) {
        this.UPDATE_VIEW_NOTIFICATIONS_CENTER(val)
      }
    }
  },
  methods: {
    ...mapMutations(['UPDATE_VIEW_NOTIFICATIONS_CENTER'])
  }
}
</script>

<style></style>
