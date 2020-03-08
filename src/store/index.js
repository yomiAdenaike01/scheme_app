import Vue from "vue";
import Vuex from "vuex";
import Comms from "./Comms";
import Admin from "./Admin";
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

  modules: { Comms, Admin },
  plugins: [VuexReset({ trigger: "REMOVE_USER" })]
});
