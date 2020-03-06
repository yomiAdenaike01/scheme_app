import { guide } from "@/stubs/guide";
var UAParser = require("ua-parser-js");

export default {
  getActiveDialog: ({ dialogIndex }) => dialogName => {
    return dialogIndex[dialogName].view;
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
  }
};
