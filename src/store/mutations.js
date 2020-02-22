import sounds from "@/mixins/playSound";
import Vue from "vue";
import router from "../router";

export default {
  UPDATE_DIALOG_INDEX(
    { dialogIndex },
    { dialog = "viewUser", view = false, id = null, data = null, tabIndex = 0 }
  ) {
    Vue.set(dialogIndex, dialog, { view, id, data, tabIndex });
  },
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
  UPDATE_INVALID_CLIENT(state, payload) {
    Vue.set(state, "invalidClient", payload);
  },
  UPDATE_CLIENT(state, payload) {
    Vue.set(state, "clientInformation", payload);
    localStorage.setItem("clientInformation", JSON.stringify(payload));
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

  UPDATE_SETTINGS(state, { category, key, value }) {
    Vue.set(state["localSettings"], category[key], value);
  },
  UPDATE_GLOBAL_LOADER(state, payload) {
    Vue.set(state, "globalLoader", payload);
  },
  REMOVE_USER(state) {
    Vue.set(state, "userInformation", {});
    Vue.set(state, "token", {});

    localStorage.removeItem("token");
    localStorage.removeItem("userInformation");
  },
  UPDATE_USER(state, { user, token }) {
    Vue.set(state, "token", token);
    Vue.set(state, "userInformation", user);

    localStorage.setItem("token", token);
    localStorage.setItem("userInformation", JSON.stringify(user));
  },
  UPDATE_USER_PREFERENCES(state, { index, data }) {
    let { settings } = state.userInformation;
    Vue.set(settings, index, data);
  },
  UPDATE_NOTIFICATIONS(state, notification) {
    if (notification.type == "success") {
      notification.title = "Operation Successful";
    } else if (notification.type == "error") {
      notification.title = "Operation Unsuccessful";

      if (typeof notification.message == "object") {
        state.criticalNetworkError = true;

        if (router.currentRoute.name != "error") {
          router.push({ name: "error" });
        }
      }
    }

    if ("desktop" in notification) {
      //  params:  // 'To do list', { body: text, icon: img }
      let desktopNotification;
      let desktop = notification.desktop;
      let { content, title } = desktop;
      desktopNotification = new Notification(title, content);
      if ("click" in desktop) {
        desktopNotification.onclick = () => {
          desktop.click();
        };
      }
    }
    Vue.set(state, "notifications", [
      notification,
      ...state.localNotifications
    ]);
  }
};
