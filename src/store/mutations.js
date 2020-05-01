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
  // Team
  ADD_TEAM_MEMBER(state, payload) {
    let teamMemberIndex = state.team.findIndex(x => {
      return x.email == payload.email;
    });
    if (teamMemberIndex == -1) {
      state.team.push(payload);
      updateBreadCrumbs(state, "teamRef", {
        payload,
        index: state.team.length - 1
      });
    }
  },
  REASSIGN_TEAM_MEMBERS(state, { assignment = "team", group }) {
    let groupedElements = [],
      groupKey = assignment == "team" ? "groupID" : "type";
    for (let i = 0, len = state[assignment].length; i < len; i++) {
      let { groupID } = state[assignment][i];
      if (groupID == group) {
        groupedElements.push({ index: i, groupID });
        Vue.set(state[assignment][i], groupKey, 0);
      }
    }
    updateBreadCrumbs(state, "groupRef", { group: group, groupedElements });
  },
  DELETE_TEAM_MEMBER(state, teamMemberIndex) {
    teamMemberIndex = teamMemberIndex ? teamMemberIndex : state.team.length - 1;

    updateBreadCrumbs(state, "teamRef", state.team[teamMemberIndex]);

    Vue.delete(state.team, teamMemberIndex);
  },
  UPDATE_TEAM(state, payload) {
    if (Array.isArray(payload) && state.team.length == 0) {
      state.team = payload;
    }
    if (Array.isArray(payload) && state.team.length > 0) {
      for (let i = 0, len = state.team.length; i < len; i++) {
        let teamMember = state.team[i];
        let member = payload.find(payloadMember => {
          return payloadMember._id == teamMember._id;
        });
        if (!member) {
          state.team.push(member);
        }
      }
    }
  },
  UPDATE_TEAM_MEMBER_GROUP(state, { index, groupType, payload }) {
    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: state.team[index]
    });

    state.team[index][groupType] = {
      ...state.team[index][groupType],
      ...payload
    };
  },

  UPDATE_ONE_TEAM_MEMBER(state, { index, payload }) {
    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: state.team[index]
    });

    state.team[index] = Object.assign(state.team[index], payload);
  },

  UPDATE_OVERLAY_INDEX(state, payload) {
    payload = payload
      ? payload
      : { overlay: "viewUser", view: false, id: null, data: null };
    for (let property in state.overlayIndex[payload.overlay]) {
      Vue.set(state.overlayIndex[payload.overlay], property, payload[property]);
    }
    console.log(state.overlayIndex[payload.overlay]);
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
          id: Math.random()
            .toString(16)
            .slice(2),
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
              clearStateInterval(state, payload.id);
            });
        }, payload.duration);
      };
    }

    if (!state.runningIntervals[payload.id]) {
      runInterval();
      state.runningIntervals[payload.id] = timeout;
    }
  },

  CLEAR_GLOBAL_INTERVAL(state, intervalID = null) {
    clearStateInterval(state, intervalID);
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
    for (let property in state.runningIntervals) {
      if (property != "client") {
        clearStateInterval(state, property);
      }
    }
  },

  UPDATE_USER(state, { user, token }) {
    state.token = token;
    state.userInformation = Object.assign(state.userInformation, user);
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
