import sounds from "@/mixins/playSound";
import alterTheme from "@/mixins/alterTheme";
import Vue from "vue";
Vue.mixin(alterTheme);

export default {
  UPDATE_SERVER_HEALTH_STATUS(state, payload) {
    Vue.set(state, "serverHealth", payload);
  },
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
    Vue.set(state, "clientInformation", payload);
  },
  UPDATE_UPLOAD_TIMESHEET(state, payload) {
    Vue.set(state, "weeklyTimesheetUploaded", payload);
  },
  UPDATE_DEFAULT_FONT(state, payload) {
    Vue.set(state, "defaultSize", {
      minFontSize: payload.min,
      maxFontSize: payload.max
    });
  },
  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },
  UPDATE_USER_NOTIFICATIONS(state, payload) {
    Vue.set(state, "userNotifications", payload);
  },
  UPDATE_VIEW_NOTIFICATIONS_CENTER(state, payload) {
    Vue.set(state, "viewNotificationsCenter", payload);
  },
  UPDATE_SETTINGS(state, { category, key, value }) {
    Vue.set(state["localSettings"], category[key], value);
  },
  UPDATE_GLOBAL_LOADER(state, payload) {
    Vue.set(state, "globalLoader", payload);
  },
  REMOVE_USER(state) {
    Vue.set(state, "currentUser", {});
    Vue.set(state, "token", {});

    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  },
  UPDATE_USER(state, { user, token }) {
    Vue.set(state, "token", token);
    Vue.set(state, "currentUser", user);

    localStorage.setItem("token", token);
    localStorage.setItem("currentUser", JSON.stringify(user));
  },

  UPDATE_NOTIFICATIONS(state, notification) {
    notification.showClose = false;
    if (notification.type == "success") {
      notification.title = "Opeartion Successful";
      sounds.methods.playSuccessSound();
    } else if (notification.type == "error") {
      notification.title = "Operation Unsuccessful";
      if (typeof notification.message == "object") {
        state.criticalNetworkError = true;
      }
    }
    Vue.set(state, "notifications", [notification, ...state.notifications]);
  }
};
