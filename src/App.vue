<template>
  <div
    id="app"
    v-resize-text="defaultSize"
    v-loading="globalLoader"
    :class="{ mobile: $mq != 'lg' }"
  >
    <AppBar v-if="validRoute" />
    <el-row type="flex" style="height:100%">
      <el-col style="flex:1">
        <Navigation v-if="(validRoute && $mq == 'lg') || viewMobileMenu" />
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
  name: 'app',

  computed: {
    ...mapState([
      'notifications',
      'globalLoader',
      'currentUser',
      'userNotifications',
      'viewMobileMenu',
      'defaultSize'
    ]),

    validRoute() {
      let $route = this.$route
      return $route.name != 'login' && $route.name != 'register'
    }
  },
  // activated() {
  //   if (this.$mq == 'lg') {
  //     this.UPDATE_DEFAULT_FONT({ min: '12px', max: '16px' })
  //   }
  // },
  methods: {
    ...mapMutations(['UPDATE_NOTIFICATIONS', 'UPDATE_DEFAULT_FONT']),
    ...mapActions(['getNotifications']),
    viewMenu() {
      console.log('Sometihgn')
    }
  },
  components: {
    Navigation,
    AppBar,
    NotificationsCenter
  },
  watch: {
    notifications(val) {
      this.$notify(val[0])
    }
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow: hidden;
  /**
 _   _  _  ___ _  _    ___ 
| \_/ |/ \| o ) || |  | __|
| \_/ ( o ) o \ || |_ | _| 
|_| |_|\_/|___/_||___||___|
                                                                                    
 */
  &.mobile {
    overflow: scroll;
    .el-drawer__body {
      overflow-y: scroll;
    }
  }
}
.trigger {
  cursor: pointer;
}
html,
body {
  height: 100%;
}
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 20px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #999;
}
.primary {
  color: #2f74eb;
}
@import './assets/spacing';
@import url('http://fast.fonts.net/t/1.css?apiType=css&projectid=ac1e1b2a-4472-4043-bb43-7925ca5b822d');
@font-face {
  font-family: 'AvenirNextLTW01-Regular';
  src: url('./assets/Fonts/e9167238-3b3f-4813-a04a-a384394eed42.eot?#iefix');
  src: url('./assets/Fonts/e9167238-3b3f-4813-a04a-a384394eed42.eot?#iefix')
      format('eot'),
    url('./assets/Fonts/2cd55546-ec00-4af9-aeca-4a3cd186da53.woff2')
      format('woff2'),
    url('./assets/Fonts/1e9892c0-6927-4412-9874-1b82801ba47a.woff')
      format('woff'),
    url('./assets/Fonts/46cf1067-688d-4aab-b0f7-bd942af6efd8.ttf')
      format('truetype');
}

@font-face {
  font-family: 'Tw Cen MT W01 Light';
  src: url('./assets/Fonts/52a3cf55-5046-4363-af0a-a8831748f1ab.eot?#iefix');
  src: url('./assets/Fonts/52a3cf55-5046-4363-af0a-a8831748f1ab.eot?#iefix')
      format('eot'),
    url('./assets/Fonts/33b518fd-1640-44a6-8544-977f3f878471.woff2')
      format('woff2'),
    url('./assets/Fonts/9a0194a4-ab74-415d-bb64-ffb9df6a8f9c.woff')
      format('woff'),
    url('./assets/Fonts/c37166d3-5187-4a9b-9482-b0a8102f5f69.ttf')
      format('truetype');
}

* {
  font-family: 'AvenirNextLTW01-Regular';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

.light {
  font-weight: 300;
}
.bold {
  font-weight: bold;
}
.grey {
  color: #999;
}
.black {
  color: black;
}

a {
  text-decoration: none;
}
.member_name {
  text-transform: capitalize;
}
</style>
