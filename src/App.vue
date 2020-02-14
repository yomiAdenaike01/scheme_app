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
    <div class="h-100">
      <RouterTransition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </RouterTransition>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import Title from "@/components/Title";
import refactorLocation from "@/mixins/refactorLocation";
import alterTheme from "@/mixins/alterTheme";
import CriticalError from "@/components/CriticalError";
import ClientIntro from "@/components/ClientIntro";
import RouterTransition from "@/components/RouterTransition";
export default {
  name: "app",
  data() {
    return {
      clientName: "",
      clientInterval: null,
      windowClient: window.location.hostname.toString().split("."),
      runLoading: true
    };
  },
  async created() {
    this.loggerController();

    if (this.isValidClient) {
      this.SET_THEME();
    }

    if (this.runInterval) {
      this.clientInterval = setInterval(async () => {
        try {
          let response = await this.getClient();
          this.UPDATE_CLIENT(response);
        } catch (error) {
          console.log(error);
        }
      }, this.requestIntervals.client);
    } else {
      try {
        let response = await this.getClient();
        this.UPDATE_CLIENT(response);
      } catch (error) {
        this.UPDATE_INVALID_CLIENT({ display: true, error: true });
        console.log(error);
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
      "userInformation",
      "defaultSize",
      "clientInformation",
      "criticalNetworkError",
      "invalidClient"
    ]),
    ...mapState("Admin", ["team", "shifts"]),

    ...mapGetters(["isValidClient"]),

    loading() {
      // Check team and schedule
      let res;
      if (this.criticalNetworkError || this.invalidClient.display) {
        res = false;
      } else {
        res = Object.keys(this.clientInformation).length == 0;
      }
      return res;
    },
    runInterval() {
      return (
        this.$route.name != "register" && this.isValidClient && !this.noClient
      );
    }
  },
  mixins: [refactorLocation, alterTheme],
  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["UPDATE_CLIENT", "UPDATE_INVALID_CLIENT", "SET_THEME"]),
    loggerController() {
      if (process.env.NODE_ENV != "development") {
        window.console.log = function() {};
        window.console.warn = function() {};
        window.console.error = function() {};
      }
    },

    getClient(clientName) {
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
              this.UPDATE_INVALID_CLIENT({ display: true, error: true });
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
    CriticalError,
    ClientIntro,
    RouterTransition
  },

  watch: {
    "clientInformation.colours"(val) {
      this.mutateTheme(val);
    },
    notifications(val) {
      this.$notify(val[0]);
    },
    criticalNetworkError(val) {
      if (val) {
        clearInterval(this.clientInterval);
      }
    }
  }
};
</script>
