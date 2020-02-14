import Vue from "vue";
export default {
  // Reports

  UPDATE_REPORTS_METRICS() {},
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
  UPDATE_SHIFTS(state, payload) {
    Vue.set(state, "shifts", payload);
  },
  UPDATE_REQUESTS(state, payload) {
    let unreadRequests = payload.filter(request => {
      return !request.is_read;
    });
    // Append notifications
    Vue.set(state, "notifications", [
      ...state.notifications,
      ...unreadRequests
    ]);
    Vue.set(state, "requests", unreadRequests);
  },
  UPDATE_TEAM(state, payload) {
    Vue.set(state, "team", payload);
  },
  UPDATE_VIEW_TEAM_MEMBER(state, payload) {
    Vue.set(state, "viewTeamMember", payload);
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
