import Vue from "vue";

export default {
  getUserGroups(state, getters, { clientInformation }) {
    let arr = [];
    for (let i = 0, len = clientInformation?.userGroups.length; i < len; i++) {
      let group = clientInformation?.userGroups[i];
      if (group?.groupID == 0) {
        continue;
      } else {
        arr.push({ label: group.label, value: group._id });
      }
    }
    return arr;
  },

  getUsersInUserGroup: ({ team }) => userGroup => {
    return team
      .filter(({ groupID }) => {
        return userGroup == groupID;
      })
      .map(({ _id }) => {
        return _id;
      });
  },
  getFilteredTeam: ({ team }, getters, { userInformation }) => {
    return team.filter(({ _id }) => {
      return _id != userInformation._id;
    });
  },

  getUsersEvents: ({ events }) => id => {
    return events.all.filter(event => {
      return event.assignedTo.some(a => {
        return a == id;
      });
    });
  },

  getValidEventTypes(
    state,
    getters,
    { clientInformation, userInformation },
    rootGetters
  ) {
    let hasValues = Vue.prototype.hasEntries(clientInformation);
    let arr = [];
    if (hasValues) {
      let eventGroups = [...clientInformation.eventGroups];
      let {
        userGroup: { _id }
      } = userInformation;
      if (!rootGetters.getIsAdmin) {
        for (let i = 0, len = eventGroups.length; i < len; i++) {
          let eventGroup = eventGroups[i];
          let userGroupIndex = eventGroup.enabledFor.indexOf(_id);
          if (userGroupIndex > -1) {
            let enabledGroup = eventGroup.enabledFor[userGroupIndex];
            let dropDownData = {
              value: enabledGroup._id,
              label: enabledGroup.label
            };
            arr.push(dropDownData);
          }
        }
      } else {
        arr = eventGroups.map(group => {
          return {
            label: group.label,
            value: group._id
          };
        });
      }
    }
    return arr;
  },

  getDropdownTeamMembers(state) {
    let team = [...state.team];
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
  getUserInformation: ({ team }, getters, { userInformation }) => (
    match,
    params = "_id"
  ) => {
    let userInfo = null;
    if (match == userInformation[params]) {
      userInfo = userInformation;
    } else {
      if (Vue.prototype.hasEntries(team)) {
        userInfo = team.find(member => {
          return member[params] == match;
        });
      }
    }
    return userInfo;
  }
};
