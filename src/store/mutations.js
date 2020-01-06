import storage from "./storage";
import sounds from "@/mixins/playSound";

export default {
  UPDATE_DEFAULT_FONT(state, payload) {
    state.defaultSize = { minFontSize: payload.min, maxFontSize: payload.max };
  },
  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    state.viewMobileMenu = payload;
  },
  UPDATE_USER_NOTIFICATIONS(state, payload) {
    state.userNotifications = payload;
  },
  UPDATE_VIEW_NOTIFICATIONS_CENTER(state, payload) {
    state.viewNotificationsCenter = payload;
  },
  UPDATE_SETTINGS(state, { category, key, value }) {
    state.localSettings[category][key] = value;
  },
  UPDATE_GLOBAL_LOADER(state, payload) {
    state.globalLoader = payload;
  },
  REMOVE_USER(state) {
    state.currentUser = {};
    state.token = {};
    storage.remove("token");
    storage.remove("currentUser");
  },
  UPDATE_USER(state, payload) {
    state.currentUser = payload.user;
    state.token = payload.token;
    storage.set("token", payload.token);
    storage.set("currentUser", payload.user);
  },

  UPDATE_NOTIFICATIONS(state, notification) {
    if (notification.type == "success") {
      notification.title = "Opeartion Successful";
      sounds.methods.playSuccessSound();
    } else if (notification.type == "error") {
      notification.title = "Operation Unsuccessful";
      sounds.methods.playErrorSound();
    }
    if (notification.message.toLowerCase() == "network error") {
      sounds.methods.playErrorSound();
      state.critical_network_error = true;
    }
    state.notifications.unshift(notification);
  }
};
