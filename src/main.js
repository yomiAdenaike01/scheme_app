import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import NProgress from "vue-nprogress";

// Plugins
import "./plugins/mobile";
import "./plugins/resizeText";
import "./plugins/element";
import "./plugins/firebase";
import "./plugins/shortKeys";
import "boxicons";

// Prototypes
import "./plugins/prototypes";

const nprogress = new NProgress({
  showSpinner: false
});

Vue.use(NProgress, {
  latencyThreshold: 0
});

let { hostname } = window.location;
hostname = hostname.split(".")[0];
document.title = `${hostname} - Powered By Schemeapp.cloud`;

new Vue({
  router,
  store,
  nprogress,
  render: h => h(App)
}).$mount("#app");
