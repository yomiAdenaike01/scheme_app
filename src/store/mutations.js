import storage from "./storage";
import sounds from "@/mixins/playSound";
import alterTheme from "@/mixins/alterTheme";
import Vue from "vue";
Vue.mixin(alterTheme);
export default {
  UPDATE_COLOURS(state, { target, val }) {
    state.localSettings.colours[target] = val;
  },
  SET_THEME() {
    let id = "chalk-style";
    let styleTag = document.getElementById(id);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.setAttribute("id", id);
      styleTag.innerText = localStorage.getItem("cssText");

      document.head.appendChild(styleTag);
    }
  },
  UPDATE_CLIENT(state, payload) {
    state.client = payload;
    // alterTheme.mutateTheme(payload.company_colours);
  },
  UPDATE_UPLOAD_TIMESHEET(state, payload) {
    state.weeklyTimesheetUploaded = payload;
  },
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
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
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
      // sounds.methods.playErrorSound();
    } else if (notification.message == "network error") {
      state.critical_network_error = true;
    }
    state.notifications.unshift(notification);
  }
};
