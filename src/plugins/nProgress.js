import Vue from "vue";
import NProgress from "vue-nprogress";

const options = {
  latencyThreshold: 0, // Number of ms before progressbar starts showing, default: 100,
  router: true // Show progressbar when navigating routes, default: true
};
Vue.use(NProgress, options);
