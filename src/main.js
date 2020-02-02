import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// Plugins
import "./plugins/mobile";
import "./plugins/resizeText";
import "./plugins/element";
import "./plugins/firebase";
import "./plugins/clickOutside";
import "./plugins/google";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
