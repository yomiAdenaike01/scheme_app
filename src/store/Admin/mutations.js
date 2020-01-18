export default {
  UPDATE_SHIFTS(state, payload) {
    state.shifts = payload;
  },
  UPDATE_REQUESTS(state, payload) {
    let unreadRequests = payload.filter(request=>{return !request.is_read});
    // Append notifications 
    state.notifications.push(...unreadRequests);
    state.requests = unreadRequests;
    
  },
  UPDATE_TEAM(state, payload) {
    state.team = payload;
  },
  UPDATE_VIEW_TEAM_MEMBER(state, payload) {
    state.viewTeamMember = payload;
  }
};
