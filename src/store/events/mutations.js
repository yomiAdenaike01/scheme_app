import Vue from "vue";
import updateBreadCrumbs from "../helpers";

export default {
  // Event templates
  UPDATE_EVENT_TEMPLATES(state, payload) {
    for (let i = 0, len = payload.length; i < len; i++) {
      let payloadTemplate = payload[i];
      let stateTemplate = state.eventTemplates.find(template => {
        return template._id == payloadTemplate._id;
      });
      if (!stateTemplate) {
        state.eventTemplates.push(payloadTemplate);
      }
    }
  },
  CREATE_EVENT_TEMPLATE(state, payload) {
    let templateIndex = state.eventTemplate.findIndex(template => {
      return template.name == payload.name;
    });
    if (templateIndex == -1) {
      state.eventTemplates.push(payload);
      updateBreadCrumbs(
        state,
        "eventTemplateRef",
        state.eventTemplates.length - 1
      );
    }
    if (payload.index) {
      let eventTemplate = state.eventTemplates[payload.index];
      state.eventTemplates.splice(payload.index, 1, eventTemplate);
    } else {
      state.eventsTemplates.push(payload);
    }
    updateBreadCrumbs(state, { index: state.eventTemplates.length, payload });
  },
  DELETE_EVENT_TEMPLATE(state, index) {
    if (!index) {
      index = state.eventTemplate.length - 1;
    }
    updateBreadCrumbs(state, state.eventTemplates[index]);
    Vue.delete(state.eventTemplates, index);
  },
  UPDATE_EVENT_TEMPLATE(state, { index, update }) {
    if (!index) {
      index = state.eventTemplate.length - 1;
    }
    updateBreadCrumbs(state, { index, update: state.eventTemplates[index] });
    for (let i = 0, len = update.length; i < len; i++) {
      let template = update[i];
      let templateIndex = state.eventTemplates.findIndex(stateTemplate => {
        return stateTemplate._id == template._id;
      });
      if (templateIndex > -1) {
        state.eventTemplates.push(template);
      }
    }
  },

  UPDATE_EVENT_FILTERS(state, payload) {
    Vue.set(state, "eventFilters", payload);
  },

  // Events
  UPDATE_EVENTS(state, payload) {
    for (let i = 0, len = payload.length; i < len; i++) {
      let event = payload[i];
      let isDuplicateEvent = state.events.findIndex(payloadEvent => {
        return payloadEvent._id == event._id;
      });
      if (isDuplicateEvent == -1) {
        state.events.push(event);
      }
    }
  },
  CREATE_EVENT(state, payload) {
    // Get the data

    let { clientevent_groups, ...eventData } = payload;
    state.events.push(eventData);
    updateBreadCrumbs(state, "eventRef", {
      index: state.events.length - 1
    });
  },
  UPDATE_EVENT(state, { eventIndex, payload }) {
    let event = state.events[eventIndex];
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      payload: event
    });

    state.events[eventIndex] = {
      ...event,
      ...payload
    };
  },
  DELETE_EVENT(state, eventIndex) {
    if (!eventIndex) {
      eventIndex = state.team.length - 1;
      state.events.pop();
    }
    if (state.events[eventIndex]) {
      let eventAtIndex = state.events[eventIndex];
      updateBreadCrumbs(state, "eventRef", {
        eventIndex,
        payload: eventAtIndex
      });
      Vue.delete(state.events, eventIndex);
    }
  },

  ADD_USER_TO_EVENT(state, { eventIndex, payload }) {
    state.events[eventIndex].assigned_to.push(payload);
    updateBreadCrumbs(state, "eventRef", {
      userIndex: state.events[eventIndex].assigned_to.length - 1,
      eventIndex
    });
  },
  DELETE_USER_FROM_EVENT(state, { eventIndex, userIndex }) {
    let user = state.events[eventIndex].assigned_to[userIndex];
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      payload: user
    });
    Vue.delete(state.events[eventIndex].assigned_to, userIndex);
  },

  UPDATE_APPROVE_EVENT(state, { eventIndex, userID }) {
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      userID
    });
    state.events[eventIndex].is_approved.push(userID);
  },
  UPDATE_REJECT_EVENT(state, { eventIndex, userID }) {
    let userIndex = state.events[eventIndex].is_approved.findIndex(index => {
      return index._id == userID;
    });
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      userID
    });
    Vue.delete(state.events[eventIndex].is_approved, userIndex);
  }
};
