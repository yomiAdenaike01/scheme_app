export default {
  getTeamMember(state, getters, rootState) {
    return (toMatch, teamMemberProperty) => {
      let foundTeamMember = state.team.find(x => {
        return x[teamMemberProperty] == toMatch;
      });
      if (foundTeamMember) {
        return foundTeamMember;
      } else if (toMatch == rootState.currentUser[teamMemberProperty]) {
        return rootState.currentUser;
      } else {
        return null;
      }
    };
  }
};
