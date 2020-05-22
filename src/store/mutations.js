import Vue from "vue";
import VueRouter from "../router";
import updateBreadCrumbs from "./helpers";
import mixins from "@/mixins/genID";

const deleteStateInterval = (state, intervalID) => {
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
const deleteSystemNotification = (state, notificationIndex) => {
  Vue.delete(state.systemNotifications, notificationIndex);
};
export default {
  UPDATE_OVERLAY_INDEX(state, payload) {
    payload = payload
      ? payload
      : { overlay: "viewUser", view: false, id: null, data: null };
    for (let property in state.overlayIndex[payload.overlay]) {
      Vue.set(state.overlayIndex[payload.overlay], property, payload[property]);
    }
    state.overlayHistory = payload;
  },

  CREATE_GROUP(state, { groupType, payload }) {
    let group = state.clientInformation[groupType];

    let groupExists =
      state.clientInformation[groupType].findIndex(group => {
        return group?.label?.toLowerCase() == payload?.label?.toLowerCase();
      }) > -1;

    if (!groupExists) {
      group.push(payload);
      updateBreadCrumbs(state, "groupRef", { groupType, payload });
    }
  },

  DELETE_GROUP(state, { groupType, groupIndex }) {
    updateBreadCrumbs(state, "groupRef", {
      groupType,
      payload: state.clientInformation[groupType][groupIndex]
    });

    Vue.delete(state.clientInformation[groupType], groupIndex);
  },

  UPDATE_GROUP(state, { groupType, groupIndex, payload }) {
    updateBreadCrumbs(state, "groupRef", {
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

  CREATE_GLOBAL_INTERVAL(state, payload) {
    payload = payload
      ? payload
      : {
          duration: 3000,
          method: () => {},
          id: mixins.methods.genID(),
          immediate: false
        };
    if (payload.immediate) {
      payload.method();
      if (payload.immediateCallback) {
        payload.immediateCallback();
      }
    }

    let timeout;

    if (!state.runningIntervals?.id) {
      var runInterval = () => {
        timeout = setTimeout(() => {
          payload
            .method()
            .finally(() => {
              runInterval();
            })
            .catch(() => {
              deleteStateInterval(state, payload.id);
            });
        }, payload.duration);
      };
    }

    if (!state.runningIntervals[payload.id]) {
      runInterval();
      state.runningIntervals[payload.id] = timeout;
    }
  },

  DELETE_GLOBAL_INTERVAL(state, intervalID = null) {
    deleteStateInterval(state, intervalID);
  },

  UPDATE_CLIENT_INFORMATION(state, payload) {
    state.clientInformation = Object.assign(state.clientInformation, payload);
  },

  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },

  DELETE_API_NOTIFICATION(state, notificationIndex) {
    notificationIndex = notificationIndex
      ? notificationIndex
      : state.apiNotifications.length - 1;

    updateBreadCrumbs(state, {
      notificationIndex,
      notification: state.apiNotifications[notificationIndex]
    });
    Vue.delete(state.apiNotifications, notificationIndex);
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
    deleteStateInterval(state);
  },

  UPDATE_USER(state, payload) {
    state.userInformation = Object.assign(state.userInformation, payload);
  },

  UPDATE_USER_SESSION(state, payload) {
    state.token = payload;
  },
  DELETE_SYSTEM_NOTIFICATION(state, notificationIndex) {
    deleteSystemNotification(state, notificationIndex);
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

    let notificationXref = {
      success: "check-circle",
      error: "x-circle",
      warning: "error-circle",
      message: "message-rounded",
      annoucement: "user-voice",
      info: "mail-send"
    };
    notification._id = mixins.methods.genID();

    let closeNotificationObject = {
      label: "Close",
      body() {
        let notificationIndex = state.systemNotifications.findIndex(
          _notification => {
            return _notification._id == notification._id;
          }
        );
        deleteSystemNotification(state, notificationIndex);
      }
    };
    if (!notification?.methods) {
      notification.methods = [];
    }

    notification.methods.unshift(closeNotificationObject);
    if (notificationTypes.indexOf(notification.type) == -1) {
      notification.type = "info";
    }
    if (!notification?.icon) {
      notification.icon = notificationXref[notification.type];
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

    if (document.visibilityState == "hidden") {
      //  params:  // 'To do list', { body: text, icon: img }

      let desktopNotification = new Notification(notification.title, {
        icon: "",
        body: notification.message
      });
      desktopNotification.onclick = () => {
        window.focus();
        if (notification?.methods) {
          notification.methods[0].body();
        } else {
          if (!notification?.route) {
            VueRouter.push({ name: "Common" });
          }
          VueRouter.push(notification.route);
        }
      };
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
      let timeOut = state.systemNotifications.length * 5000;
      let removeNotificationTimeout = setTimeout(() => {
        state.systemNotifications.pop();
      }, timeOut);
    }
  }
};
