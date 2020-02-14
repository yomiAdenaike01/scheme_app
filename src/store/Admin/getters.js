import Vue from "vue";
export default {
  getAllShifts(state) {
    return state.shifts.all;
  },

  getEnabledEvents(state, getters, { clientInformation, userInformation }) {
    let hasValues = Vue.prototype.hasEntries(clientInformation);
    if (hasValues) {
      let eventGroups = [...clientInformation.eventGroups];
      let { groupID } = userInformation;

      return eventGroups.filter(evnt => {
        // enabled for equal to user group
        let index = evnt.enabledFor.findIndex(enbled => {
          return enbled == groupID;
        });
        return index > -1;
      });
    }
  },

  getDropdownTeamMembers(state) {
    let team = [...state.team];
    return team.map(({ name, value }) => {
      return {
        name,
        value
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
      } else if (toMatch == rootState.userInformation[teamMemberProperty]) {
        return rootState.userInformation;
      } else {
        return null;
      }
    };
  }
};
