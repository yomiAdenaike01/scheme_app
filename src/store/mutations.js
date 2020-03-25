// import sounds from "@/mixins/playSound";
import Vue from "vue";
import VueRouter from "../router";

function clearStateInterval(state, intervalID) {
  if (!intervalID) {
    for (let i = 0, len = state.runningIntervals.length; i < len; i++) {
      clearTimeout(state.runningIntervals[i]);
    }
    Vue.set(state, "runningIntervals", []);
  } else {
    let intervalIndex = state.runningIntervals.findIndex(interval => {
      return interval == intervalID;
    });
    clearInterval(intervalID);
    Vue.delete(state.runningIntervals, intervalIndex);
  }
}

export default {
  UPDATE_DIALOG_INDEX(
    { dialogIndex },
    { dialog = "viewUser", view = false, id = null, data = null, tabIndex = 0 }
  ) {
    Vue.set(dialogIndex, dialog, { view, id, data, tabIndex });
  },
  CREATE_INTERVAL(state, { duration, method, id, immediate }) {
    if (immediate) {
      method();
    }
    clearInterval(id);
    id = setInterval(() => {
      method().catch(() => {
        clearStateInterval(state, id);
      });
    }, duration);

    if (state.runningIntervals.indexOf(id) == -1) {
      state.runningIntervals.push(id);
    }
  },

  CLEAR_INTERVAL(state, intervalID) {
    clearStateInterval(state, intervalID);
  },

  UPDATE_CLIENT(state, payload) {
    Vue.set(state, "clientInformation", payload);
    localStorage.setItem("clientInformation", JSON.stringify(payload));
  },

  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },
  UPDATE_USER_NOTIFICATIONS(state, payload) {
    Vue.set(state, "userNotifications", payload);
  },

  UPDATE_GLOBAL_LOADER(state, payload) {
    Vue.set(state, "globalLoader", payload);
  },
  REMOVE_USER() {
    VueRouter.push({ name: "login" });
    localStorage.removeItem("token");
    localStorage.removeItem("userInformation");
  },
  UPDATE_USER(state, { user, token }) {
    Vue.set(state, "token", token);
    Vue.set(state, "userInformation", user);

    localStorage.setItem("token", token);
    localStorage.setItem("userInformation", JSON.stringify(user));
  },

  UPDATE_NOTIFICATIONS(state, notification) {
    let notificationTypes = [
      "success",
      "error",
      "warning",
      "message",
      "annoucement",
      "info"
    ];
    notification.showClose = true;
    notification.dangerouslyUseHTMLString = true;

    if (notificationTypes.indexOf(notification.type) == -1) {
      notification.type = "info";
    }
    switch (notification.type) {
      case "message":
        notification.icon = "message-rounded";
        notification.title = "New Message";
        break;
      case "announcement": {
        (notification.icon = "bx-user-voice"),
          (notification.title = "Announcement");
        break;
      }

      default:
        break;
    }
    if (notification?.icon) {
      notification.iconClass = `custom_notification_icon bx bx-${notification?.icon} bx-tada`;
      delete notification.type;
    }

    if (notification.type == "success") {
      notification.title = "Operation Successful";
    } else if (notification.type == "error") {
      notification.title = "Operation Unsuccessful";

      if (typeof notification.message == "object") {
        state.criticalNetworkError = true;
        state.errorInformation = notification.message;

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
