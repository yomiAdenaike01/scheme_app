export default {
  getClient(state) {
    let client;
    if (Object.keys(state.client).length > 0) {
      client = state.client;
    }
    return client;
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
    let colours = state.client.company_colours;
    if (colours.length > 0) {
      return colours;
    } else {
      return [];
    }
  }
};
