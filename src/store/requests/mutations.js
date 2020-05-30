import updateBreadCrumbs from "../helpers";
import Vue from "vue";
export default {
  CREATE_REQUEST(state, payload) {
    state.requests.push(payload);

    updateBreadCrumbs(state, "requestRef", {
      index: state.requests.length - 1,
      ...payload
    });
  },
  DELETE_REQUEST(state, index) {
    if (typeof index == "undefined") {
      state.requests.pop();
    } else {
      updateBreadCrumbs(state, "requestRef", state.requests[index]);
      state.requests.splice(index, 1);
    }
  },
  UPDATE_REQUEST(state, { index, update }) {
    let request = state.requests[index];
    updateBreadCrumbs(state, "requestRef", {
      index,
      ...request
    });
    if (update && typeof update == "object") {
      for (let property in update) {
        Vue.set(state.requests[index], property, update[property]);
      }
    }
  },
  UPDATE_REQUESTS(state, payload) {
    state.requests = payload;
  }
};
