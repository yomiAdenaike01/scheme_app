import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

import Events from "./events";
import Tasks from "./tasks";
import Comms from "./comms";
import Requests from "./requests";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,

  modules: { Requests, Comms, Events, Tasks }
});
