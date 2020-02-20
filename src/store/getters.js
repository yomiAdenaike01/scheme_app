import { guide } from "@/stubs/guide";
var UAParser = require("ua-parser-js");

export default {
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
  isValidClient(state, getters) {
    return Object.keys(state.clientInformation).length > 0;
  },
  isValidUser(state) {
    return Object.keys(state.userInformation).length > 0;
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
  getContentLoaded(state) {
    return false;
  },
  getIsAdmin(state) {
    const groupID = state.userInformation.groupID;
    return groupID == 1 || groupID == "Admin";
  },
  getClientColours(state) {
    return state.clientInformation.colours;
  },
  getName(state) {
    return state.userInformation.name.trim().toLowerCase();
  },
  getGuide() {
    return guide;
  },
  getDefaultColour(state) {
    return state.defaultCustomColours[0];
  }
};
