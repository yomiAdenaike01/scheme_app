import state from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

export default {
  namespaced: true,
  state: state,
  actions: actions,
  getters: getters,
  mutations: mutations
};
