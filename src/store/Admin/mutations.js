import Vue from "vue";
export default {
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
  }
};
