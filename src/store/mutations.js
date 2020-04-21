import Vue from "vue";
import VueRouter from "../router";
import updateBreadCrumbs from "./helpers";
import notificationsLogic from "@/mixins/notificationsLogic";

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
  ADD_TOUR_STEP() {},
  UPDATE_DIALOG_INDEX(
    state,
    { dialog = "viewUser", view = false, id = null, data = null, tabIndex = 0 }
  ) {
    Vue.set(state.dialogIndex, dialog, { view, id, data, tabIndex });
    state.lastDialog = { dialog, view, id, data, tabIndex };
  },

  CREATE_GROUP(state, { groupType, payload }) {
    let group = state.clientInformation[groupType];
    let groupExists =
      state.clientInformation[groupType].findIndex(group => {
        return group?.label?.toLowerCase() == payload?.label?.toLowerCase();
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
  UPDATE_ALL_NOTIFICATIONS(state, payload) {
    updateBreadCrumbs(state, payload);
    for (let i = 0, len = state.userNotifications.length; i < len; i++) {
      state.userNotifications[i] = {
        ...state.userNotifications[i],
        ...payload
      };
    }
  },
  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },
  DELETE_NOTIFICATION(state, notificationIndex) {
    if (!notificationIndex) {
      state.userNotifications.pop();
    } else {
      updateBreadCrumbs(state, {
        notificationIndex,
        notification: state.userNotifications[notificationIndex]
      });
      Vue.delete(state.userNotifications, notificationIndex);
    }
  },
  UPDATE_NOTIFICATION(state, { notificationIndex, update }) {
    updateBreadCrumbs(state, {
      notificationIndex,
      update: state.userNotifications[notificationIndex]
    });
    state.userNotifications.splice(notificationIndex, 0, {
      ...state.userNotifications[notificationIndex],
      ...update
    });
  },
  UPDATE_USER_NOTIFICATIONS(state, payload) {
    for (let i = 0, len = payload.length; i < len; i++) {
      let payloadNotification = payload[i];
      let stateNotification = state.userNotifications.find(notification => {
        return notification._id == payloadNotification._id;
      });
      if (!stateNotification) {
        state.userNotifications.push(payloadNotification);
      }
    }
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
    notification = notificationsLogic.methods.sortNotification(notification);

    if (notification?.icon) {
      notification.iconClass = `custom_notification_icon bx bx-${notification.icon} bx-tada`;
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
