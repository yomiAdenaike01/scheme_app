import Vue from "vue";
import VueRouter from "../router";
import updateBreadCrumbs from "./helpers";
import mixins from "@/mixins/genID";

const deleteStateInterval = (state, intervalID) => {
  const deleteInterval = interval => {
    Vue.set(state.runningIntervals, interval, null);
  };

  if (!intervalID) {
    for (let property in state.runningIntervals) {
      clearTimeout(state.runningIntervals[property]);

      deleteInterval(property);
    }
  } else {
    clearTimeout(state.runningIntervals[intervalID]);
    deleteInterval(intervalID);
  }
};
const deleteSystemNotification = (state, index) => {
  Vue.delete(state.systemNotifications, index);
};
export default {
  UPDATE_STOP_NOTIFICATIONS(state, payload) {
    state.stopNotifications = payload;
  },
  UPDATE_INTERVAL_DELAY(state, { interval, timing }) {
    state.globalIntervals[interval] = timing;
  },
  UPDATE_OVERLAY_INDEX(state, overlayData) {
    let payload = overlayData.payload;
    let { overlay, display } = overlayData;
    Vue.set(state.overlayIndex, overlay, { display, payload });
  },

  CREATE_GLOBAL_INTERVAL(state, payload) {
    let intervals = state.runningIntervals;
    let visible = document.visibilityState == "hidden";

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

    if (!visible) {
      payload.duration = payload.duration * 2;
    }

    let timeout;
    // if the timeout exists run it

    const runInterval = () => {
      timeout = setTimeout(() => {
        // check that the ID is not null
        if (intervals[payload.id] != null) {
          payload
            .method()
            .finally(() => {
              runInterval();
            })
            .catch(() => {
              deleteStateInterval(state, payload.id);
            });
        }
      }, payload.duration);
    };

    if (!intervals[payload.id]) {
      runInterval();
      Vue.set(intervals, payload.id, timeout);
    }
  },

  DELETE_GLOBAL_INTERVAL(state, intervalID = null) {
    deleteStateInterval(state, intervalID);
  },

  UPDATE_CLIENT_INFORMATION(state, payload) {
    state.clientInformation = payload;
  },

  UPDATE_TOGGLE_MOBILE_MENU(state, payload) {
    Vue.set(state, "viewMobileMenu", payload);
  },

  DELETE_API_NOTIFICATION(state, index) {
    index = index ? index : state.apiNotifications.length - 1;

    updateBreadCrumbs(state, {
      index,
      notification: state.apiNotifications[index]
    });
    Vue.delete(state.apiNotifications, index);
  },

  UPDATE_API_NOTIFICATIONS(state, payload) {
    state.apiNotifications = payload;
  },

  UPDATE_API_NOTIFICATION(state, { index, update }) {
    let notification = state.apiNotifications[index];

    updateBreadCrumbs(state, {
      index,
      update: notification
    });

    for (let property in update) {
      Vue.set(notification, property, update[property]);
    }
  },
  UPDATE_STOP_NOTIFICATIONS(state, payload) {
    state.stopNotifications = payload;
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
  },

  UPDATE_USER(state, payload) {
    state.userInformation = Object.assign({}, state.userInformation, payload);
  },

  UPDATE_USER_SESSION(state, payload) {
    state.token = payload;
  },
  DELETE_SYSTEM_NOTIFICATION(state, index) {
    deleteSystemNotification(state, index);
  },
  CREATE_SYSTEM_NOTIFICATION(state, notification) {
    let notificationTypes = Object.keys(state.iconXref);

    notification._id = mixins.methods.genID();

    let closeNotificationObject = {
      label: "Close",
      body() {
        let index = state.systemNotifications.findIndex(_notification => {
          return _notification._id == notification._id;
        });
        deleteSystemNotification(state, index);
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
      notification.icon = `bx ${state.iconXref[notification.type]}`;
    }

    if (notification.type == "success" && !notification.title) {
      notification.title = "Operation Successful";
    } else if (notification.type == "error" && !notification.title) {
      notification.title = "Operation Unsuccessful";

      if (typeof notification.message == "object") {
        state.criticalNetworkError = true;
        state.errorInformation = notification.message;
      }
    }

    if (document.visibilityState == "hidden") {
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

    let index = state.systemNotifications.findIndex(({ message }) => {
      return message == notification.message;
    });
    if (index == -1) {
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
