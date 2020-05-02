import updateBreadCrumbs from "../helpers";
import Vue from "vue";
export default {
  DELETE_REQUEST(state, index) {
    updateBreadCrumbs(state, "requestRef", {
      index,
      request: state.requests[index]
    });
    Vue.delete(state.requests, index);
  },
  UPDATE_REQUEST(state, { request, index }) {
    updateBreadCrumbs(state, "requestRef", {
      index,
      request
    });
    let updatedRequest = { ...request, ...state.requests[index] };
    state.requests.splice(index, 1, updatedRequest);
    console.log(state.requests);
  },
  UPDATE_REQUESTS(state, payload) {
    if (!Array.isArray(payload)) {
      payload = [payload];
    }

    for (let i = 0, len = payload.length; i < len; i++) {
      let payloadRequest = payload[i];
      let stateRequest = state.requests.find(request => {
        return request._id == payloadRequest._id;
      });
      if (!stateRequest) {
        state.requests.push(payloadRequest);
      }
    }
  }
};
