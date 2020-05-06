export default {
  getDropdownTeamMembers({ team }) {
    team = [...team];
    return team.map(({ name, _id }) => {
      return {
        label: name,
        value: _id
      };
    });
  },
  getTeamMemberInformation: ({ team }) => findBy => {
    if (Number.isInteger(findBy)) {
      return team[findBy];
    } else {
      return team.find(member => {
        return member._id == findBy;
      });
    }
  },
  getFilteredTeam: ({ team }, getters, { userInformation }) => {
    return team.filter(({ _id }) => {
      return _id != userInformation._id;
    });
  }
};
