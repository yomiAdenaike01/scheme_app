<template>
  <el-drawer :visible.sync="viewNotifications">
    <Title
      title="Notifications Centre"
      subtitle="View and interact will notifications here."
      slot="title"
    />
    <transition name="el-fade-in">
      <el-row v-if="userNotifications.length > 0">
        <el-col
          v-for="notification in userNotifications"
          :key="notification._id"
        >
          <Notification :notification="notification" />
        </el-col>
      </el-row>
    </transition>
    <el-container
      v-if="userNotifications.length <= 0"
      style="background:rgb(250,250,250); height:100%;"
    >
      <el-main style="display:flex; align-items:center; justify-content:center">
        <h1 class="grey light">No notifications found.</h1>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Notification from './Notification'
import Title from '@/components/Title'
export default {
  name: 'NotificationsCenter',
  mounted() {},
  computed: {
    ...mapState([
      'viewNotificationsCenter',
      'userNotifications',
      'currentUser'
    ]),
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
  },
  components: {
    Notification,
    Title
  }
}
</script>

<style lang="scss" scoped></style>
