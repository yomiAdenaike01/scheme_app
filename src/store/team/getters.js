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
  userLookup: ({ team }, getters, { userInformation }) => (
    match,
    params = "_id"
  ) => {
    let userInfo = null;
    if (match == userInformation[params]) {
      userInfo = userInformation;
    } else {
      if (team.length > 0) {
        userInfo = team.find(member => {
          return member[params] == match;
        });
      }
    }
    return userInfo;
  },

  getFilteredTeam: ({ team }, getters, { userInformation }) => {
    return team.filter(({ _id }) => {
      return _id != userInformation._id;
    });
  }
};
