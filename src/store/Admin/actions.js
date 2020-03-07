export default {
  getNotes(context, id) {
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
          console.log(response);
          context.commit("UPDATE_NOTES", response);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getTasks(context, id) {
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
          context.commit("UPDATE_TASKS", response);
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
  getEvents(context, params = {}) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "events/all",
        params
      };
      context
        .dispatch("request", payload, { root: true })
        .then(response => {
          context.commit("UPDATE_EVENTS", response);
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
