import Vue from "vue";
export default {
  UPDATE_EVENT_TEMPLATES(state, payload) {
    Vue.set(state, "eventTemplates", payload);
  },
  // Reports
  UPDATE_EVENT_FILTERS(state, payload) {
    Vue.set(state, "eventFilters", payload);
  },
  // Regular admins
  UPDATE_DISPLAY_NOTE(state, payload, display) {
    if (display) {
      Vue.set(state.viewNote, "display", display);
    }
    Vue.set(state, "viewNote", payload);
  },
  UPDATE_EVENTS(state, payload) {
    Vue.set(state, "eventsInformation", payload);
  },
  UPDATE_REQUESTS(state, payload) {
    state.requestsInformation = payload;
  },
  UPDATE_TEAM(state, payload) {
    Vue.set(state, "teamInformation", payload);
  },

  UPDATE_NOTES(state, payload) {
    if (Array.isArray(payload)) {
      Vue.set(state, "notes", payload);
    }
    state.notes.push(payload);
  },
  UPDATE_TASKS(state, payload) {
    if (Array.isArray(payload)) {
      Vue.set(state, "tasks", payload);
    }
    let index = state.tasks.findIndex(todo => {
      return (todo.title = payload.title);
    });
    if (index == -1) {
      state.tasks.push(payload);
    }
  }
};
