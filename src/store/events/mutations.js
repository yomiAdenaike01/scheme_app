import Vue from "vue";
import updateBreadCrumbs from "../helpers";

export default {
  // Event templates
  UPDATE_EVENT_TEMPLATES(state, payload) {
    state.eventTemplates = payload;
  },
  CREATE_EVENT_TEMPLATE(state, payload) {
    state.eventTemplates.push(payload);
    updateBreadCrumbs(
      state,
      "eventTemplateRef",
      state.eventTemplates.length - 1
    );
  },
  DELETE_EVENT_TEMPLATE(state, index) {
    if (!index) {
      state.eventTemplates.pop();
    }
    updateBreadCrumbs(state, {
      payload: state.eventTemplates[state.eventTemplates.length - 1]
    });
    state.eventTemplates.splice(index, 1);
  },
  UPDATE_EVENT_TEMPLATE(state, payload) {
    if (!payload.index) {
      var index = state.eventTemplates.length - 1;
    }
    updateBreadCrumbs(state, { index, update: state.eventTemplates[index] });

    state.eventTemplates.splice(index, 1, payload.data);
  },

  // Events
  UPDATE_EVENTS(state, payload) {
    state.events = payload;
  },
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
  },
  UPDATE_EVENT_REQUESTS(state, payload) {
    state.eventRequests = payload;
  },
  CREATE_EVENT(state, payload) {
    // Get the data
    state.events.push(payload);
    updateBreadCrumbs(state, "eventRef", {
      index: state.events.length - 1
    });
  },
  UPDATE_EVENT(state, { index = state.events.length - 1, payload }) {
    let event = state.events[index];
    updateBreadCrumbs(state, "eventRef", {
      index,
      payload: event
    });

    state.events.splice(index, 1, payload);
  },
  DELETE_EVENT(state, index) {
    if (!index) {
      state.events.pop();
    }
    if (state.events[index]) {
      let eventAtIndex = state.events[index];
      updateBreadCrumbs(state, "eventRef", {
        index,
        payload: eventAtIndex
      });
      state.events.splice(index, 1);
    }
  },

  ADD_USER_TO_EVENT(state, { index, payload }) {
    state.events[index].assigned_to.push(payload);
    updateBreadCrumbs(state, "eventRef", {
      userIndex: state.events[index].assigned_to.length - 1,
      index
    });
  },
  DELETE_USER_FROM_EVENT(state, { index, userIndex }) {
    let user = state.events[index].assigned_to[userIndex];
    updateBreadCrumbs(state, "eventRef", {
      index,
      payload: user
    });
    Vue.delete(state.events[index].assigned_to, userIndex);
  },

  UPDATE_APPROVE_EVENT(state, { index, userID }) {
    updateBreadCrumbs(state, "eventRef", {
      index,
      userID
    });
    state.events[index].is_approved.push(userID);
  },
  UPDATE_REJECT_EVENT(state, { index, userID }) {
    let userIndex = state.events[index].is_approved.findIndex(index => {
      return index._id == userID;
    });
    updateBreadCrumbs(state, "eventRef", {
      index,
      userID
    });
    Vue.delete(state.events[index].is_approved, userIndex);
  }
};
