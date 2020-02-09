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
import "./plugins/clickOutside";

const nprogress = new NProgress({
  showSpinner: false
});

Vue.use(NProgress, {
  latencyThreshold: 0
});

new Vue({
  router,
  store,
  nprogress,
  render: h => h(App)
}).$mount("#app");
