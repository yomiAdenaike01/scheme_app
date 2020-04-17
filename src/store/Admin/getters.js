import Vue from "vue";

export default {
  getUserGroups(state, getters, { clientInformation }) {
    let arr = [];
    for (let i = 0, len = clientInformation?.userGroups.length; i < len; i++) {
      let group = clientInformation?.userGroups[i];
      if (group?.groupID == 0) {
        continue;
      } else {
        arr.push({ label: group.label, value: group.groupID });
      }
    }
    return arr;
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
  getUsersInUserGroup: ({ teamInformation }) => userGroup => {
    return teamInformation
      .filter(({ groupID }) => {
        return userGroup == groupID;
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
          let { _id, name } = teamMember;

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

      let arr = [];
      for (let i = 0, len = eventGroups.length; i < len; i++) {
        let eventGroup = eventGroups[i],
          enabledIndex = eventGroup.enabledFor.findIndex(index => {
            return index == groupID || index == 0;
          });
        if (enabledIndex > -1) {
          arr.push({ label: eventGroup.label, value: eventGroup.groupID });
        }
      }
      return arr;
    }
  },

  getDropdownTeamMembers(state) {
    let team = [...state.teamInformation];
    return team.map(({ name, _id }) => {
      return {
        label: name,
        value: _id
      };
    });
  },

  getGroupName: (state, getters, { clientInformation }) => (groupType, id) => {
    let res = {};

    if (groupType == "user") {
      groupType = "userGroups";
    } else {
      groupType = "eventGroups";
    }

    if (Vue.prototype.hasEntries(clientInformation)) {
      res = clientInformation[groupType].find(({ groupID }) => {
        return groupID == id;
      });
    }
    return res;
  },
  getUserInformation: ({ teamInformation }, getters, { userInformation }) => (
    match,
    params = "_id"
  ) => {
    let userInfo = null;
    if (match == userInformation[params]) {
      userInfo = userInformation;
    } else {
      if (Vue.prototype.hasEntries(teamInformation)) {
        userInfo = teamInformation.find(member => {
          return member[params] == match;
        });
      }
    }
    return userInfo;
  }
};
