import { guide } from "@/stubs/guide";
var UAParser = require("ua-parser-js");

export default {
  getCurrentTabXref: () => ({ tabs, currentTab }) => {
    let tabLabel = tabs[currentTab].label;
    return {
      name: tabLabel.replace(/\s/g, "_").toLowerCase(),
      display: tabLabel
    };
  },
  getUserDevices({ userInformation: { devicesInformation } }) {
    return devicesInformation;
  },
  getCurrentVersion() {
    return require("../../package.json").version;
  },
  getIsIE(
    state,
    {
      getUAInformation: {
        browser: { name }
      }
    }
  ) {
    let nonSupportedBrowsers = ["IE", "IEMobile"];
    return nonSupportedBrowsers.indexOf(name) > -1;
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
      foundDialog =  dialogIndex[dialogName].view;
    } else {
      for (let property in dialogIndex) {
        if (dialogIndex[property].view) {
          foundDialog = dialogIndex[property];
        }
      }
    }
    return foundDialog
  },
  getUserNotificationsLength({ userNotifications }) {
    return userNotifications.filter(notification => {
      return (
        notification.status != "is_read" && notification.status != "is_complete"
      );
    }).length;
  },
  getUAInformation() {
    return new UAParser().getResult();
  },
  getUserSettings(state) {
    return state.userInformation.settings;
  },
  getClient({clientInformation}, {isValidClient}) {
    if (isValidClient) {
      return clientInformation;
    } else {
      return {};
    }
  },
  getPreferences({userInformation:{preferences}}) {
    return preferences;
  },
  getIsAdmin({ userInformation: { groupID } }) {
    return groupID == 1;
  },
  getClientColours({clientInformation:{colours}}) {
    return colours;
  },

  getGuide() {
    return guide;
  },
  getDefaultColour({defaultCustomColours}) {
    return defaultCustomColours[0];
  },
  getRandomColour({ defaultCustomColours }) {
    return defaultCustomColours[
      Math.round(Math.random() * defaultCustomColours.length)
    ];
  }
};
