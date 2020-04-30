import Vue from "vue";
import updateBreadCrumbs from "../helpers";
/**
 *
 *
 * @param {Object} state
 * @param {string} param
 * @param {Object,string} items
 */

export default {
  DELETE_REQUEST(state, index) {
    updateBreadCrumbs(state, "requestRef", {
      index,
      request: state.requests[index]
    });
    Vue.delete(state.requests, index);
  },
  UPDATE_REQUEST(state, { request, index }) {
    console.log(state.requests);
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
  },

  CREATE_EVENT_TEMPLATE(state, payload) {
    if (payload.index) {
      let eventTemplate = state.eventTemplates[payload.index];
      state.eventTemplates.splice(payload.index, 1, eventTemplate);
    } else {
      state.eventsTemplates.push(payload);
    }
    updateBreadCrumbs(state, { index: state.eventTemplates.length, payload });
  },
  DELETE_EVENT_TEMPLATE(state, { index }) {
    updateBreadCrumbs(state, { payload: state.eventTemplates[index] });
    Vue.delete(state.eventTemplates, index);
  },
  UPDATE_EVENT_TEMPLATE(state, { index, payload }) {
    updateBreadCrumbs(state, { index, payload: state.eventTemplates[index] });
    for (let i = 0, len = payload.length; i < len; i++) {
      let template = payload[i];
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
    if (!payload?.restore) {
      payload.assigned_to = payload?.assigned_to.map(assignee => {
        return state.team.find(member => {
          return member._id == assignee;
        });
      });

      payload.type = payload.clientevent_groups.find(eventGroup => {
        return eventGroup._id == payload.type;
      });
    }
    let { clientevent_groups, ...eventData } = payload;
    // Push to upcoming
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

  REASSIGN_ELEMENTS(state, { assignment = "team", group }) {
    let groupedElements = [],
      groupKey = assignment == "team" ? "groupID" : "type";
    for (let i = 0, len = state[assignment].length; i < len; i++) {
      let { groupID } = state[assignment][i];
      if (groupID == group) {
        groupedElements.push({ index: i, groupID });
        Vue.set(state[assignment][i], groupKey, 0);
      }
    }
    updateBreadCrumbs(state, "groupRef", { group: group, groupedElements });
  },

  //  Teams
  UPDATE_TEAM(state, payload) {
    if (Array.isArray(payload) && state.team.length == 0) {
      state.team = payload;
    }
    if (Array.isArray(payload) && state.team.length > 0) {
      for (let i = 0, len = state.team.length; i < len; i++) {
        let teamMember = state.team[i];
        let member = payload.find(payloadMember => {
          return payloadMember._id == teamMember._id;
        });
        if (!member) {
          state.team.push(member);
        }
      }
    }
  },
  ADD_TEAM_MEMBER(state, payload) {
    let teamMemberIndex = state.team.findIndex(x => {
      return x.email == payload.email;
    });
    if (teamMemberIndex == -1) {
      state.team.push(payload);
      updateBreadCrumbs(state, "teamRef", {
        payload,
        index: state.team.length - 1
      });
    }
  },
  DELETE_TEAM_MEMBER(state, teamMemberIndex) {
    updateBreadCrumbs(state, "teamRef", state.team[teamMemberIndex]);
    Vue.delete(state.team, teamMemberIndex);
  },
  UPDATE_TEAM_MEMBER_GROUP(state, { index, groupType, payload }) {
    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: state.team[index]
    });
    state.team[index][groupType] = {
      ...state.team[index][groupType],
      ...payload
    };
  },
  UPDATE_ONE_TEAM_MEMBER(state, { index, payload }) {
    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: state.team[index]
    });
    for (let property in payload) {
      Vue.set(state.team[index], property, { ...payload[property] });
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
