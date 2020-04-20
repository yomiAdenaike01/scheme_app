import templateActions from "./subactions/templates";
import eventActions from "./subactions/events";
import taskActions from "./subactions/tasks";
export default {
  ...templateActions,
  ...eventActions,
  ...taskActions,
  getNotes(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "GET",
            url: "notes/get"
          },
          { root: true }
        )
        .then(response => {
          context.commit("UPDATE_NOTES", response);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getTasks(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "GET",
            url: "tasks/get"
          },
          { root: true }
        )
        .then(response => {
          console.warn(response);
          context.commit("UPDATE_TASK_BOARDS", response);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getNotifications(context) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "/notifications/all"
      };
      context
        .dispatch("request", payload, { root: true })
        .then(response => {
          context.commit("UPDATE_USER_NOTIFICATIONS", response, { root: true });
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getTeam(context) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "/users/all"
      };
      context
        .dispatch("request", payload, { root: true })
        .then(response => {
          context.commit("UPDATE_TEAM", response);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
