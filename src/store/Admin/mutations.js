export default {
  UPDATE_SHIFTS(state, payload) {
    state.shifts = payload;
  },
  UPDATE_REQUESTS(state, payload) {
    state.requests = payload;
  },
  UPDATE_TEAM(state, payload) {
    state.team = payload;
  },
  UPDATE_VIEW_TEAM_MEMBER(state, payload) {
    state.viewTeamMember = payload;
  }
};
