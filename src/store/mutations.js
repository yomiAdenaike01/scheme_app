import Vue from "vue";
import VueRouter from "../router";
import updateBreadCrumbs from "./helpers";
import notificationLogic from "@/mixins/notificationsLogic";

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
  console.log(state.runningIntervals);
};

export default {
  // create user
  CREATE_USER(state, payload) {
    state.team.push(payload);
    updateBreadCrumbs(state, "teamRef", {
      index: state.team.length
    });
  },
  DELETE_USER(state, index) {
    if (!index) {
      index = state.team.length - 1;
    }
    updateBreadCrumbs(state, "teamRef", {
      payload: {
        index,
        payload: state.team[index]
      }
    });
    Vue.delete(state.team, index);
  },

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
    for (let property in payload) {
      Vue.set(
        state.clientInformation[groupType][groupIndex],
        property,
        payload[property]
      );
    }
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
    console.log(state.runningIntervals);
  },

  CLEAR_GLOBAL_INTERVAL(state, intervalID = null) {
    clearStateInterval(state, intervalID);
  },

  UPDATE_CLIENT_INFORMATION(state, payload) {
    state.clientInformation = Object.assign(payload, state.clientInformation);
  },

  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },

  DELETE_API_NOTIFICATION(state, notificationIndex) {
    if (!notificationIndex) {
      state.apiNotifications.pop();
    } else {
      updateBreadCrumbs(state, {
        notificationIndex,
        notification: state.apiNotifications[notificationIndex]
      });
      Vue.delete(state.apiNotifications, notificationIndex);
    }
  },

  UPDATE_API_NOTIFICATIONS(state, payload) {
    updateBreadCrumbs(state, payload);
    for (let i = 0, len = state.apiNotifications.length; i < len; i++) {
      for (let property in payload) {
        Vue.set(state.apiNotifications[i], property, payload[property]);
      }
    }
  },
  UPDATE_API_NOTIFICATION(state, { notificationIndex, update }) {
    updateBreadCrumbs(state, {
      notificationIndex,
      update: state.apiNotifications[notificationIndex]
    });
    for (let property in update) {
      Vue.set(
        state.apiNotifications[notificationIndex],
        property,
        update[property]
      );
    }
  },

  UPDATE_SYSTEM_NOTIFICATIONS(state, payload) {
    for (let i = 0, len = payload.length; i < len; i++) {
      let payloadNotification = payload[i];
      let stateNotification = state.systemNotifications.find(notification => {
        return notification._id == payloadNotification._id;
      });
      if (!stateNotification) {
        state.systemNotifications.push(payloadNotification);
      }
    }
  },

  UPDATE_NETWORK_ERROR(state, payload) {
    state.networkError = payload;
  },
  DELETE_USER_SESSION(state) {
    state.apiNotifications = [];
    state.systemNotifications = [];

    if (VueRouter.currentRoute.name != "signIn") {
      VueRouter.push({ name: "signIn" });
    }
    for (let property in state.runningIntervals) {
      if (property != "client") {
        clearStateInterval(state, property);
      }
    }
  },
  UPDATE_USER(state, { user, token }) {
    state.token = token;
    state.userInformation = user;
  },

  CREATE_SYSTEM_NOTIFICATION(state, notification) {
    let notificationTypes = [
      "success",
      "error",
      "warning",
      "message",
      "annoucement",
      "info"
    ];
    notification._id = Math.random()
      .toString(16)
      .slice(2);

    let closeNotification = {
      label: "Close",
      function() {
        let _notificationIndex = state.systemNotifications.findIndex(
          _notification => {
            return _notification._id == notification._id;
          }
        );

        Vue.delete(state.systemNotifications, _notificationIndex);
      }
    };
    if (!notification?.methods) {
      notification.methods = [];
    }

    notification.methods.unshift(closeNotification);
    if (notificationTypes.indexOf(notification.type) == -1) {
      notification.type = "info";
    }
    notification = notificationLogic.methods.sortNotification(notification);

    if (notification?.icon) {
      notification.icon = `custom_notification_icon bx bx-${notification.icon} bx-tada`;
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

    if (notification?.desktop) {
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

    let notificationIndex = state.systemNotifications.findIndex(
      ({ message }) => {
        return message == notification.message;
      }
    );
    if (notificationIndex == -1) {
      state.systemNotifications.push(notification);
    }
    if (state.systemNotifications.length > 0) {
      clearTimeout(removeNotificationTimeout);
      let removeNotificationTimeout = setTimeout(() => {
        state.systemNotifications.pop();
      }, 9000);
    }
  }
};
