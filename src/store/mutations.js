import sounds from "@/mixins/playSound";
import Vue from "vue";
import VueRouter from "../router";
import updateBreadCrumbs from "./helpers";

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
    state,
    { dialog = "viewUser", view = false, id = null, data = null, tabIndex = 0 }
  ) {
    Vue.set(state.dialogIndex, dialog, { view, id, data, tabIndex });
    state.lastDialog = { dialog, view, id, data, tabIndex };
  },

  // Groups
  CREATE_GROUP(state, { groupType, payload }) {
    let group = state.clientInformation[groupType];
    let groupExists =
      state.clientInformation[groupType].findIndex(group => {
        return group.label == payload.label;
      }) > -1;
    if (!groupExists) {
      group.push(payload);
      updateBreadCrumbs(state, "rootGroupRef", { groupType, payload });
    }
  },
  DELETE_GROUP(state, { groupType, groupIndex }) {
    Vue.delete(state.clientInformation[groupType], groupIndex);
  },
  UPDATE_GROUP(state, { groupType, groupIndex, payload }) {
    updateBreadCrumbs(state, "rootGroupRef", {
      groupType,
      groupIndex,
      payload
    });
    Vue.set(
      state.clientInformation[groupType][groupIndex],
      "label",
      payload.label
    );
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

  CLEAR_GLOBAL_INTERVAL(state, intervalID = null) {
    clearStateInterval(state, intervalID);
  },

  UPDATE_CLIENT_INFORMATION(state, payload) {
    let action = payload.action ? payload.action : (payload.action = "assign");
    if (action == "assign") {
      state.clientInformation = payload;
      localStorage.setItem("clientInformation", JSON.stringify(payload));
    } else {
      state.clientInformation[payload.key] = payload.value;
      localStorage.setItem(
        "clientInformation",
        JSON.stringify(state.clientInformation)
      );
    }
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
    if (VueRouter.currentRoute.name != "signIn") {
      VueRouter.push({ name: "signIn" });
    }
    localStorage.clear();
  },
  UPDATE_USER(state, { user, token }) {
    state.token = token;
    state.userInformation = user;
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
        if (document.visibilityState == "visible") {
          sounds.methods.playSuccessSound();
        }
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

    if (notification.type == "success" && !notification.title) {
      notification.title = "Operation Successful";
    } else if (notification.type == "error" && !notification.title) {
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
