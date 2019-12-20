<template>
  <div id="app" v-loading="getContentLoaded">
    <Navigation v-if="$route.name != 'login' && $route.name != 'register'" />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "app",

  computed: {
    ...mapGetters(["getContentLoaded"])
  },
  created() {
    this.getTeam();
    this.getTranscripts();
    this.getShifts();
  },
  methods: {
    ...mapActions(["getTeam", "getShifts"]),
    ...mapActions("Comms", ["getTranscripts"])
  },
  components: {
    Navigation: () => import("@/components/Navigation")
  }
};
</script>

<style lang="scss">
#app {
  height: 100%;
  overflow: hidden;
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
@import "./assets/spacing";
@import url("http://fast.fonts.net/t/1.css?apiType=css&projectid=ac1e1b2a-4472-4043-bb43-7925ca5b822d");
@font-face {
  font-family: "AvenirNextLTW01-Regular";
  src: url("./assets/Fonts/e9167238-3b3f-4813-a04a-a384394eed42.eot?#iefix");
  src: url("./assets/Fonts/e9167238-3b3f-4813-a04a-a384394eed42.eot?#iefix")
      format("eot"),
    url("./assets/Fonts/2cd55546-ec00-4af9-aeca-4a3cd186da53.woff2")
      format("woff2"),
    url("./assets/Fonts/1e9892c0-6927-4412-9874-1b82801ba47a.woff")
      format("woff"),
    url("./assets/Fonts/46cf1067-688d-4aab-b0f7-bd942af6efd8.ttf")
      format("truetype");
}

* {
  font-family: "AvenirNextLTW01-Regular";
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
.el-dialog__header {
  background: #2f74eb;
  .el-dialog__title,
  .el-dialog__headerbtn .el-dialog__close {
    color: white;
    &:hover {
      color: white;
    }
  }
}
a {
  text-decoration: none;
}
</style>
