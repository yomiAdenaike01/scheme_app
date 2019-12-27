export default {
  UPDATE_SHIFTS(state, payload) {
    state.shifts = payload
  },
  UPDATE_REQUESTS(state, payload) {
    state.requests = payload
  },
  UPDATE_TEAM(state, payload) {
    state.team = payload
  },
  UPDATE_VIEW_USER(state, payload) {
    state.viewUser = payload
  }
}
