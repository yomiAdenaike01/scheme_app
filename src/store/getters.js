import { guide } from "@/stubs/guide";
var UAParser = require("ua-parser-js");

export default {
  getCurrentVersion() {
    return require("../../package.json").version;
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
    if (dialogName) {
      return dialogIndex[dialogName].view;
    } else {
      for (let property in dialogIndex) {
        if (dialogIndex[property].view) {
          context;
        }
      }
    }
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
  getClient(state, getters) {
    if (getters.isValidClient) {
      return state.clientInformation;
    } else {
      return {};
    }
  },
  getPreferences(state) {
    return state.userInformation.preferences;
  },
  getIsAdmin({ userInformation: { groupID } }) {
    return groupID == 1;
  },
  getClientColours(state) {
    return state.clientInformation.colours;
  },

  getGuide() {
    return guide;
  },
  getDefaultColour(state) {
    return state.defaultCustomColours[0];
  },
  getRandomColour({ defaultCustomColours }) {
    return defaultCustomColours[
      Math.round(Math.random() * defaultCustomColours.length)
    ];
  }
};
