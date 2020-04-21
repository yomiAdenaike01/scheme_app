export default {
  getRequests({ dispatch, rootState, commit }, userID) {
    let _id = rootState.userInformation._id;
    if (userID) {
      _id = userID;
    }
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "events/requests/all",
        params: { _id }
      };
      dispatch("request", payload, { root: true })
        .then(response => {
          if (!userID) {
            commit("UPDATE_REQUESTS", response);
            resolve();
          } else {
            resolve(response);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  getEvents({ dispatch, commit }, params = {}) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "events/all"
      };
      dispatch("request", payload, { root: true })
        .then(response => {
          commit("UPDATE_EVENTS", response);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  createEvent(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit("CREATE_EVENT", {
        clientEventGroups: context.rootState.clientInformation.eventGroups,
        ...payload
      });
      context
        .dispatch(
          "request",
          {
            method: "POST",
            url: "events/create",
            data: payload,
            disableNotifications: true
          },
          { root: true }
        )
        .then(() => {
          resolve();
        })
        .catch(() => {
          context.commit("DELETE_EVENT");
          reject();
        });
    });
  },
  updateEvents({ dispatch }, { update, id }) {
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
