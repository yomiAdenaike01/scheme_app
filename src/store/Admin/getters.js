export default {
  getAllShifts(state){
    return state.shifts.all;
  },
  getDropdownTeamMembers(state) {
    return state["team"].map(member => {
      return {
        text: member["name"].toString(),
        value: member["_id"].toString()
      };
    });
  },
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
