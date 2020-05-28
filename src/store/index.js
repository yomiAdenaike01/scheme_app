import Vue from "vue";
import Vuex from "vuex";
import VuexReset from "@ianwalter/vuex-reset";

import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

import Events from "./events";
import Tasks from "./tasks";
import Comms from "./messenger";
import Team from "./team";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [VuexReset({ trigger: "DELETE_USER_SESSION" })],

  state,
  mutations,
  actions,
  getters,
  modules: { Comms, Events, Tasks, Team }
});
