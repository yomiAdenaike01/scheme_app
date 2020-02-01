import { guide } from "@/stubs/guide";
export default {
  isValidClient(state, getters) {
    return Object.keys(state.clientInformation).length > 0;
  },
  getSidebarColour(state) {
    return state.localSettings.colours.sidebar;
  },
  getClient(state, getters) {
    if (getters.isValidClient) {
      return state.clientInformation;
    } else {
      return {};
    }
  },
  getPreferences(state) {
    return state.currentUser.preferences;
  },
  getContentLoaded(state) {
    return false;
  },
  getIsAdmin(state) {
    const employee_type = state.currentUser.employee_type;
    return employee_type == 1 || employee_type == "Admin";
  },
  getCompanyColours(state) {
    let colours = state.clientInformation.colours;
    if (colours.length > 0) {
      return colours;
    } else {
      return [];
    }
  },
  getName(state) {
    return state.currentUser.name.trim().toLowerCase();
  },
  getGuide() {
    return guide;
  }
};
