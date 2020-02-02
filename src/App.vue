<template>
  <div
    id="app"
    v-resize-text="defaultSize"
    :class="{ mobile: $mq != 'lg' }"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 1)"
    :element-loading-text="
      `Loading
    client instance please wait....`
    "
  >
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import Title from "@/components/Title";
import refactorLocation from "@/mixins/refactorLocation";
import InvalidClient from "@/components/InvalidClient";
import alterTheme from "@/mixins/alterTheme";
import CriticalError from "@/components/CriticalError";
export default {
  name: "app",
  data() {
    return {
      clientName: "",
      clientInterval: null,
      invalidClient: false,
      windowClient: window.location.hostname.toString().split(".")
    };
  },
  async created() {
    if (this.isValidClient) {
      this.SET_THEME();
    }

    if (this.runInterval) {
      this.clientInterval = setInterval(async () => {
        try {
          let response = await this.getClient();
          this.UPDATE_CLIENT(response);
        } catch (error) {
          this.genError(error);
        }
      }, this.requestIntervals.client);
    } else {
      try {
        let response = await this.getClient();
        this.UPDATE_CLIENT(response);
      } catch (error) {
        this.genError(error, false);
      }
    }
  },
  destroyed() {
    clearInterval(this.clientInterval);
  },
  computed: {
    ...mapState([
      "requestIntervals",
      "notifications",
      "currentUser",
      "defaultSize",
      "clientInformation",
      "criticalNetworkError"
    ]),
    ...mapState("Admin", ["team", "shifts"]),
    ...mapGetters(["isValidClient"]),
    loading() {
      // Check team and schedule
      return (
        this.team.length == 0 && Object.keys(this.clientInformation).length == 0
      );
    },
    runInterval() {
      return this.$route.name != "register" && this.isValidClient;
    }
  },
  mixins: [refactorLocation, alterTheme],
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_CLIENT", "SET_THEME"]),

    genError(error, displayDialog) {
      if (!displayDialog) {
        this.invalidClient = false;
      }
      this.clientInterval = null;
      this.loading = false;
      this.invalidClient = true;

      console.error(error);
    },

    getClient() {
      return new Promise((resolve, reject) => {
        let currentHostname = window.location.hostname.split(".");

        if (this.clientName.length <= 0) {
          let subdomain = this.windowClient[0];
          let domain = this.windowClient[1];

          this.request(
            {
              method: "GET",
              url: "clients/get",
              params: { clientSubdomain: subdomain }
            },
            true
          )
            .then(response => {
              resolve(response);
            })
            .catch(error => {
              reject(error);
            });
        } else {
          this.refactorWindowLocation(this.clientName);
        }
      });
    }
  },
  components: {
    Title,
    InvalidClient,
    CriticalError
  },

  watch: {
    "clientInformation.colours"(val) {
      this.mutateTheme(val);
    },
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
@import url("https://fonts.googleapis.com/css?family=Open+Sans&display=swap");

* {
  font-family: "Open Sans", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
</style>
