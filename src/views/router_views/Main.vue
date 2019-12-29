<template>
  <div class="main_wrapper">
    <AppBar />
    <el-row type="flex" style="height:100%">
      <el-col style="flex:1">
        <Navigation v-if="$mq == 'lg' || viewMobileMenu" />
      </el-col>
      <el-col>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </el-col>
    </el-row>
    <NotificationsCenter />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
import AppBar from '@/components/AppBar'
import Navigation from '@/components/Navigation'
import NotificationsCenter from '@/components/NotificationsCenter'
export default {
  name: 'Main',
  computed: {
    ...mapState([
      'notifications',
      'globalLoader',
      'currentUser',
      'userNotifications',
      'viewMobileMenu',
      'defaultSize'
    ])
  },
  components: {
    Navigation,
    AppBar,
    NotificationsCenter
  }
}
</script>

<style lang="scss" scoped>
.main_wrapper {
  height: 100%;
}
</style>
