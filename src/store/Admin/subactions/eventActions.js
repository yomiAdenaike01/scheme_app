export default {
  getRequests(context) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "events/requests/all",
      };
      context
        .dispatch("request", payload, { root: true })
        .then(response => {
          context.commit("UPDATE_REQUESTS", response);
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

  createEvent({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        {
          method: "POST",
          url: "events/create",
          data: payload
        },
        { root: true }
      )
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  updateEvents({ dispatch, commit }, { update, id }) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        {
          method: "PUT",
          url: "events/update",
          data: { update, id }
        },
        { root: true }
      )
        .then(() => {
          dispatch("getEvents");
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};
