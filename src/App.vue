<template>
  <div
    id="app"
    v-resize-text="defaultSize"
    :class="{ mobile: $mq != 'lg' }"
    v-loading="resolving"
    element-loading-background="rgba(255, 255, 255, 1)"
    :element-loading-text="
      `Loading
    scheme cloud....`
    "
  >
    <ErrorDialog
      @displayChange="error = $event"
      :display="error"
      @companyNameChange="companyName = $event"
      @getClient="getClient"
    />

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import Title from "@/components/Title";
import refactorLocation from "@/mixins/refactorLocation";
import ErrorDialog from "@/components/ErrorDialog";
export default {
  name: "app",
  data() {
    return {
      resolving: true,
      error: false,
      companyName: "",
      companyImage: "",
      clientInterval: null,
      subdomain: "",
      windowClient: window.location.hostname.toString().split(".")
    };
  },
  created() {
    if (this.isValidClient) {
      this.SET_THEME();
    }

    this.clientInterval = setInterval(() => {
      this.getClient()
        .then(response => {
          this.resolving = false;
          this.UPDATE_CLIENT(response);
        })
        .catch(error => {
          // Stop the interval
          clearInterval(this.clientInterval);
          this.clientInterval = null;
          this.error = true;
          this.resolving = false;
        });
    }, 6000);
  },
  beforeDestroy() {
    clearInterval(this.clientInterval);
  },
  computed: {
    ...mapState(["notifications", "defaultSize", "client"]),
    ...mapGetters(["isValidClient"])
  },
  mixins: [refactorLocation],
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_CLIENT", "SET_THEME"]),

    getClient() {
      return new Promise((resolve, reject) => {
        let currentHostname = window.location.hostname.split(".");
        if (this.companyName.length <= 0) {
          let subdomain = this.windowClient[0];
          let domain = this.windowClient[1];
          this.request({
            method: "GET",
            url: "clients/one",
            params: { client_name: subdomain }
          })
            .then(response => {
              let { company_image } = response;
              resolve(response);
            })
            .catch(error => {
              reject(error);
            });
        } else {
          this.refactorWindowLocation(this.companyName);
        }
      });
    }
  },
  components: {
    Title,
    ErrorDialog
  },

  watch: {
    notifications(val) {
      this.$notify(val[0]);
    }
  }
};
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
</style>
