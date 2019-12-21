<template>
  <el-row
    type="flex"
    :gutter="10"
    style="border-bottom: solid 1px #e6e6e6; height:5%"
    align="middle"
  >
    <el-col style="background:#2f74eb; color:white" :style="returnWidth">
      <h5>Business Name</h5>
      <p>Dock Pharmacy</p>
    </el-col>
    <el-col class="border">
      <Dropdown :items="items" @method="logOut">
        <Avatar :name="currentUser.name"></Avatar>
      </Dropdown>
    </el-col>
    <el-col>
      <Dropdown :items="notifications" @method="logOut" :icon="false">
        <el-badge is-dot class="item">
          <i class="el-icon-bell primary"></i>
        </el-badge>
      </Dropdown>
    </el-col>
    <UserInfoDrawer
      :display="displaySettings"
      @toggle="displaySettings = $event"
    />
  </el-row>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Dropdown from '@/components/Dropdown'
import UserInfoDrawer from './UserInfoDrawer'
import Avatar from './Avatar.vue'

export default {
  name: 'UserInfoBar',
  data() {
    return {
      displaySettings: false
    }
  },
  computed: {
    ...mapState(['currentUser']),
    navWidth() {
      let styleWidth = { width: `${150}px` }
      const navElem = document.getElementById('main_nav')
      if (navElem) {
        const width = navElem.offsetWidth
        styleWidth.width = `${width}px`
      }
      return styleWidth
    },
    notifications() {
      return [
        {
          name: 'You have a new message'
        }
      ]
    },
    items() {
      return [
        {
          name: 'Settings',
          command: 'settings'
        },
        {
          name: 'Log Out',
          command: 'log_out',
          divided: true,
          icon: 'el-icon-switch-button'
        }
      ]
    }
  },
  methods: {
    ...mapMutations(['REMOVE_USER']),
    logOut(command) {
      switch (command) {
        case 'log_out': {
          this.REMOVE_USER()
          this.$router.push({ name: 'login' })
          break
        }
        case 'settings': {
          this.displaySettings = true
          break
        }

        default:
          break
      }
    }
  },
  components: {
    Dropdown,
    UserInfoDrawer,
    Avatar
  }
}
</script>
<style lang="scss" scoped>
.el-col {
  height: 100%;
}
.client_container {
  //   flex: 0.1;
  background: #2f74eb;
  color: white;
}
.username {
  text-transform: capitalize;
}
.border {
  border-left: 1px solid #e6e6e6;
}
</style>
