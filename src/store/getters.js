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
    const employeeType = state.currentUser.employeeType;
    return employeeType == 1 || employeeType == "Admin";
  },
  getClientColours(state) {
    return state.clientInformation.colours;
    
  },
  getName(state) {
    return state.currentUser.name.trim().toLowerCase();
  },
  getGuide() {
    return guide;
  }
};
