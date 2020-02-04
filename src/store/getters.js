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
    return state.userInformation.preferences;
  },
  getContentLoaded(state) {
    return false;
  },
  getIsAdmin(state) {
    const employeeType = state.userInformation.employeeType;
    return employeeType == 1 || employeeType == "Admin";
  },
  getClientColours(state) {
    return state.clientInformation.colours;
    
  },
  getName(state) {
    return state.userInformation.name.trim().toLowerCase();
  },
  getGuide() {
    return guide;
  }
};
