// import sounds from "@/mixins/playSound";
import Vue from "vue";
import VueRouter from "../router";

const clearStateInterval = (state, intervalID) => {
  if (!intervalID) {
    for (let property in state.runningIntervals) {
      clearTimeout(state.runningIntervals[property]);
      Vue.set(state.runningIntervals, property, null);
    }
  } else {
    clearTimeout(state.runningIntervals[intervalID]);
    Vue.set(state.runningIntervals, intervalID, null);
  }
};

export default {
  UPDATE_DIALOG_INDEX(
    { dialogIndex },
    { dialog = "viewUser", view = false, id = null, data = null, tabIndex = 0 }
  ) {
    Vue.set(dialogIndex, dialog, { view, id, data, tabIndex });
  },
  CREATE_GLOBAL_INTERVAL(state, { duration = 3000, method, id, immediate }) {
    if (immediate) {
      method();
    }
    let timeout;
    if (!state.runningIntervals?.id) {
      var runInterval = () => {
        timeout = setTimeout(() => {
          method()
            .finally(() => {
              runInterval();
            })
            .catch(() => {
              clearStateInterval(state, id);
            });
        }, duration);
      };
    }

    if (!state.runningIntervals[id]) {
      runInterval();
      state.runningIntervals[id] = timeout;
    }
  },

  CLEAR_GLOBAL_INTERVAL(state, intervalID) {
    clearStateInterval(state, intervalID);
  },

  UPDATE_CLIENT_INFORMATION(state, payload) {
    Vue.set(state, "clientInformation", payload);
    localStorage.setItem("clientInformation", JSON.stringify(payload));
  },

  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },
  UPDATE_USER_NOTIFICATIONS(state, payload) {
    Vue.set(state, "userNotifications", payload);
  },

  UPDATE_NETWORK_ERROR(state, payload) {
    state.networkError = payload;
  },
  REMOVE_USER(state) {
    state.userNotifications = [];
    state.localNotifications = [];
    VueRouter.push({ name: "login" });
    localStorage.clear();
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

        if (VueRouter.currentRoute.name != "error") {
          VueRouter.push({ name: "error" });
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

    let notificationIndex = state.localNotifications.findIndex(
      ({ message }) => {
        return message == notification.message;
      }
    );
    if (notificationIndex == -1) {
      Vue.set(state, "notifications", [
        notification,
        ...state.localNotifications
      ]);
    }
  }
};
