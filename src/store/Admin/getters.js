import Vue from "vue";

export default {
  getUserGroups(state, getters, { clientInformation }) {
    let arr = [];
    for (let i = 0, len = clientInformation?.user_groups.length; i < len; i++) {
      let group = clientInformation?.user_groups[i];
      if (group?.groupID == 0) {
        continue;
      } else {
        arr.push({
          label: group.label,
          value: group._id
        });
      }
    }
    return arr;
  },

  getUsersInuser_group: ({ team }) => user_group => {
    return team
      .filter(({ groupID }) => {
        return user_group == groupID;
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

  getValidEventTypes(
    state,
    getters,
    { clientInformation, userInformation },
    rootGetters
  ) {
    let hasValues = Vue.prototype.hasEntries(clientInformation);
    let arr = [];
    if (hasValues) {
      let event_groups = [...clientInformation.event_groups];
      let {
        user_group: { _id }
      } = userInformation;
      if (!rootGetters.getIsAdmin) {
        for (let i = 0, len = event_groups.length; i < len; i++) {
          let eventGroup = event_groups[i];
          let user_groupIndex = eventGroup.enabled_for.indexOf(_id);
          if (user_groupIndex > -1) {
            let enabledGroup = eventGroup.enabled_for[user_groupIndex];
            let dropDownData = {
              value: enabledGroup._id,
              label: enabledGroup.label
            };
            arr.push(dropDownData);
          }
        }
      } else {
        arr = event_groups.map(group => {
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
      groupType = "user_groups";
    } else {
      groupType = "event_groups";
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
