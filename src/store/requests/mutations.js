import updateBreadCrumbs from "../helpers";
import Vue from "vue";
export default {
  CREATE_EVENT_REQUEST(state, payload) {
    state.eventRequests.push(payload);

    updateBreadCrumbs(state, "eventRequestRef", {
      index: state.eventRequests.length - 1,
      ...payload
    });
  },
  DELETE_EVENT_REQUEST(state, index) {
    if (!index) {
      state.eventRequests.pop();
    }
    updateBreadCrumbs(state, "eventRequestRef", state.eventRequests[index]);
    state.eventRequests.splice(index, 1);
  },
  UPDATE_EVENT_REQUEST(state, payload) {
    let { index, ...data } = payload;
    updateBreadCrumbs(state, "eventRequestRef", {
      index,
      ...state.eventRequests[index]
    });
    state.eventRequests.splice(index, 1, data);
  }
};
