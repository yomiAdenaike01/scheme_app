import { guide } from "@/stubs/guide";
import UAParser from "ua-parser-js";

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
  getPreviousDeviceInformation({ userInformation: { devicesInformation } }) {
    return devicesInformation;
  },
  getCurrentVersion() {
    return require("../../package.json").version;
  },
  getIsIE(state, { getUA }) {
    return getUA.getBrowser().name == "IE";
  },
  getIsSignedUser: (
    { userInformation: { groupID, _id }, clientInformation: { signedUser } },
    { getIsAdmin }
  ) => id => {
    let isSignedUser = false;

    isSignedUser = signedUser.indexOf(id) != -1;

    return isSignedUser;
  },
  getActiveDialog: ({ dialogIndex }) => dialogName => {
    let foundDialog = null;
    if (dialogName) {
      foundDialog = dialogIndex[dialogName].view;
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
    return getUA.getOS();
  },
  getUserSettings(state) {
    return state.userInformation.settings;
  },
  getClient({ clientInformation }, { isValidClient }) {
    if (isValidClient) {
      return clientInformation;
    } else {
      return {};
    }
  },
  getPreferences({ userInformation: { preferences } }) {
    return preferences;
  },
  getIsAdmin({ userInformation: { groupID } }) {
    return groupID == 1;
  },
  getClientColours({ clientInformation: { colours } }) {
    return colours;
  },

  getGuide() {
    return guide;
  },
  getDefaultColour({ defaultCustomColours }) {
    return defaultCustomColours[0];
  },
  getRandomColour({ defaultCustomColours }) {
    return defaultCustomColours[
      Math.round(Math.random() * defaultCustomColours.length)
    ];
  }
};
