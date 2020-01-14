import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from "firebase";
// Plugins
import "./plugins/mobile";
import "./plugins/resizeText";

import Element from "element-ui";
import "@/assets/element-variables.scss";
import locale from "element-ui/lib/locale/lang/en";

try {
  firebase.initializeApp({
    apiKey: "AIzaSyAVmzx5Xxx8Izf0Mm6MKsnpWb8HWP5C_90",
    authDomain: "schemestorage-5ed17.firebaseapp.com",
    databaseURL: "https://schemestorage-5ed17.firebaseio.com",
    projectId: "schemestorage-5ed17",
    storageBucket: "schemestorage-5ed17.appspot.com",
    messagingSenderId: "307099241375",
    appId: "1:307099241375:web:b9578dd71da6cddef8cbaa"
  });
} catch (error) {
  console.warn(error);
}

Vue.use(Element, { locale });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
