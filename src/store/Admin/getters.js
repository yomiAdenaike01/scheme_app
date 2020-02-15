import Vue from "vue";
export default {
  getAllEvents({ eventsInformation }) {
    return eventsInformation.all;
  },

  getUsersEvents: ({ eventsInformation }) => id => {
    return eventsInformation.filter(event => {
      return event.assignedTo == id;
    });
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
    let team = [...state.teamInformation];
    return team.map(({ name, _id }) => {
      return {
        name,
        value: _id
      };
    });
  },

  getGroupName: (state, getters, { clientInformation }) => (groupType, id) => {
    let res = {};
    if (Vue.prototype.hasEntries(clientInformation)) {
      if (groupType == "user") {
        groupType = "userGroups";
      } else {
        groupType = "eventGroups";
      }

      res = clientInformation[groupType].find(({ value }) => {
        return value == id;
      });
    }
    return res;
  },

  getTeamMember(state, getters, rootState) {
    return (toMatch, teamMemberProperty) => {
      let foundTeamMember = state.teamInformation.find(x => {
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
