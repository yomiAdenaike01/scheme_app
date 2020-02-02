import VueGAPI from "vue-gapi";
import Vue from "vue";
// create the 'options' object
const apiConfig = {
  apiKey:
    "731841805904-rcgjk7g81v9l37b8dci5382siohla6n7.apps.googleusercontent.com",
  clientId: "bJTsMWaSH5pyccce3uzXSz2C",
  scope: "https://www.googleapis.com/auth/calendar"
};

// Use the plugin and pass along the configuration
Vue.use(VueGAPI, apiConfig);
