import { guide } from "@/stubs/guide";
import UAParser from "ua-parser-js";
const genUUID = require("uuid-by-string");

export default {
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

  getActiveDialog: ({ dialogIndex }) => dialogName => {
    let foundDialog = null;
    if (dialogName) {
      foundDialog = dialogIndex[dialogName];
    } else {
      for (let property in dialogIndex) {
        if (dialogIndex[property].view) {
          foundDialog = dialogIndex[property];
        }
      }
    }
    return foundDialog;
  },
  getUserNotificationsLength({ userNotifications }) {
    return userNotifications.filter(notification => {
      return (
        notification.status != "is_read" && notification.status != "is_complete"
      );
    }).length;
  },
  getDeviceInformation(state, { getUA }) {
    return {
      system: getUA.getOS(),
      id: genUUID(window.navigator.userAgent.toString().trim())
    };
  },

  getClient({ clientInformation }, { isValidClient }) {
    if (isValidClient) {
      return clientInformation;
    } else {
      return {};
    }
  },

  getIsAdmin({ userInformation: { groupID } }) {
    return groupID == 1;
  },

  getGuide() {
    return guide;
  },
  getDefaultColour({ defaultCustomColours }) {
    return defaultCustomColours[0];
  }
};
