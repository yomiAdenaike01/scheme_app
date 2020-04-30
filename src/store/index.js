import Vue from "vue";
import Vuex from "vuex";

import Comms from "./comms";
import Admin from "./Admin";
import Tasks from "./tasks";

import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";
import VuexReset from "@ianwalter/vuex-reset";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state,
  mutations,
  actions,
  getters,

  modules: { Comms, Admin, Tasks }
});
