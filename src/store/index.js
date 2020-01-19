import Vue from "vue";
import Vuex from "vuex";
import Comms from "./Comms/index";
import Admin from "./Admin/index";
import VuexReset from "@ianwalter/vuex-reset";
import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
  namespaced: true,
  state: state,
  mutations: mutations,
  actions: actions,
  getters: getters,

  modules: { Comms, Admin }
  // plugins: [VuexReset({ trigger: 'REMOVE_USER' })]
});
