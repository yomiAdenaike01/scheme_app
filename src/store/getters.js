import UAParser from "ua-parser-js";
import Vue from "vue";
import { methods } from "@/mixins/genID";

export default {
  unreadNotifications(state) {
    return state.apiNotifications.filter(x => {
      return x.status == "read";
    });
  },
  getUserGroups({ clientInformation }) {
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

  getUsersInGroup: ({ team }) => user_group => {
    return team
      .filter(({ groupID }) => {
        return user_group == groupID;
      })
      .map(({ _id }) => {
        return _id;
      });
  },

  getValidEventTypes(
    { clientInformation, userInformation },
    { adminPermission }
  ) {
    let hasValues = Vue.prototype.hasEntries(clientInformation);
    let arr = [];
    if (hasValues) {
      let event_groups = [...clientInformation.event_groups];
      let {
        user_group: { _id }
      } = userInformation;
      if (!adminPermission) {
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

  groupLookup: ({ clientInformation }) => (groupType = "user", id) => {
    let res = {};

    if (groupType == "user") {
      groupType = "user_groups";
    } else {
      groupType = "event_groups";
    }

    if (Vue.prototype.hasEntries(clientInformation)) {
      res = clientInformation[groupType].find(({ _id }) => {
        return _id == id;
      });
    }
    return res;
  },

  getUA() {
    return new UAParser();
  },
  getCurrentTabXref: () => ({ tabs, currentTab }) => {
    let tabLabel = tabs[currentTab].label;
    return {
      name: tabLabel.replace(/\s/g, "_").toLowerCase(),
      display: tabLabel
    };
  },

  getCurrentVersion() {
    return require("../../package.json").version;
  },
  getIsIE(state, { getUA }) {
    return getUA.getBrowser().name == "IE";
  },

  getActiveOverlay: ({ overlayIndex }) => dialogName => {
    let foundDialog = {};
    if (dialogName) {
      foundDialog = overlayIndex[dialogName];
    } else {
      for (let property in overlayIndex) {
        if (overlayIndex[property].view == true) {
          foundDialog = { name: property, ...overlayIndex[property] };
        }
      }
    }
    console.log(foundDialog);
    return foundDialog;
  },

  getDeviceInformation(state, { getUA }) {
    return {
      system: getUA.getOS(),
      id: methods.genID()
    };
  },

  adminPermission({ userInformation: { user_group } }) {
    if (user_group) {
      return user_group.is_admin == true;
    } else {
      return false;
    }
  }
};
