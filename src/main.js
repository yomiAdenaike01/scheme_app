import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import NProgress from "vue-nprogress";

// Plugins
import "./plugins/mobile";
import "./plugins/element";
import "./plugins/firebase";
import "./plugins/shortKeys";
import "./plugins/intro";
// boxicons
import "boxicons";
// Prototypes
import "./plugins/prototypes";

String.prototype.capitalize = function() {
  return `${this.charAt(0).toUpperCase()}${this.slice(1)}`;
};

const nprogress = new NProgress({
  showSpinner: true
});

Vue.use(NProgress, {
  latencyThreshold: 0
});

let { hostname } = window.location;
hostname = hostname.split(".")[0];
document.title = `${hostname.capitalize()} - powered by schemeapp.cloud`;

new Vue({
  router,
  store,
  nprogress,
  render: h => h(App)
}).$mount("#app");
