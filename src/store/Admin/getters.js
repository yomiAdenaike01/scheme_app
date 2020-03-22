import Vue from "vue";

export default {
  getUserGroups(state, getters, { clientInformation: { userGroups } }) {
    return userGroups.filter(x => {
      return x.value != 0;
    });
  },
  getClientTimings(state, getters, { clientInformation: { timings } }) {
    return timings;
  },
  getCalTimings(state, { getClientTimings = { ...getClientTimings } }) {
    let { weekends, openingTime, closingTime } = getClientTimings;
    openingTime = openingTime * 60;
    closingTime = closingTime * 60;
    return {
      from: openingTime,
      to: closingTime,
      weekends
    };
  },
  getUsersInUserGroup: ({ teamInformation }) => userGroupID => {
    return teamInformation
      .filter(({ groupID }) => {
        return userGroupID == groupID;
      })
      .map(({ _id }) => {
        return _id;
      });
  },
  getFilteredTeam: ({ teamInformation }, getters, { userInformation }) => {
    return teamInformation.filter(({ _id }) => {
      return _id != userInformation._id;
    });
  },
  getEventAssignedTo: ({ teamInformation }) => assignedTo => {
    let assignedToData = {
      arr: [],
      text: ""
    };
    let formattedAssignedTo = [];
    if (Vue.prototype.hasEntries(teamInformation)) {
      assignedTo = assignedTo.map(assignee => {
        teamInformation.map(teamMember => {
          let { _id, name, groupID } = teamMember;

          if (assignee == _id) {
            formattedAssignedTo.push(name);
          }
        });
      });
    }

    if (Vue.prototype.hasEntries(formattedAssignedTo)) {
      assignedToData.arr = formattedAssignedTo;
      let text =
        formattedAssignedTo.length > 1
          ? `+${formattedAssignedTo.length - 1} others`
          : "";

      assignedToData.text = `${formattedAssignedTo[0]} ${text}`;
    }
    return assignedToData;
  },

  getAllEvents({ eventsInformation }) {
    return eventsInformation.all;
  },

  getUsersEvents: ({ eventsInformation }) => id => {
    return eventsInformation.all.filter(event => {
      return event.assignedTo.some(a => {
        return a == id;
      });
    });
  },

  getEnabledEvents(state, getters, { clientInformation, userInformation }) {
    let hasValues = Vue.prototype.hasEntries(clientInformation);
    if (hasValues) {
      let eventGroups = [...clientInformation.eventGroups];
      let { groupID } = userInformation;

      return eventGroups.filter(group => {
        // enabled for equal to user group
        let index = group.enabledFor.findIndex(enbled => {
          return enbled == groupID || enbled == 0;
        });
        return index > -1;
      });
    }
  },

  getDropdownTeamMembers(state) {
    let team = [...state.teamInformation];
    return team.map(({ name, _id }) => {
      return {
        text: name,
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
  getUserInformation: ({ teamInformation }, getters, { userInformation }) => (
    match,
    params = "_id"
  ) => {
    let teams;
    if (Vue.prototype.hasEntries(teamInformation)) {
      teams = teamInformation.find(member => {
        return member[params] == match;
      });
    }
    return teams;
  }
};
