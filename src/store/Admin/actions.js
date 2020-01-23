export default {
  // SHIFT METHODS

  deleteShift(context, id) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "DELETE",
            url: "shifts/delete",
            data: {
              id
            }
          },
          { root: true }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  updateShift(context, { id, update }) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "POST",
            url: "shifts/update",
            data: { id, update }
          },
          { root: true }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getNotifications(context) {
    const payload = {
      method: "GET",
      url: "/notifications/all"
    };
    context.dispatch("request", payload, { root: true }).then(response => {
      context.commit("UPDATE_USER_NOTIFICATIONS", response, { root: true });
    });
  },
  getShifts(context) {
    const payload = {
      method: "GET",
      url: "/shifts/all"
    };
    context.dispatch("request", payload, { root: true }).then(response => {
      context.commit("UPDATE_SHIFTS", response);
    });
  },

  getTeam(context) {
    const payload = {
      method: "GET",
      url: "/users/all"
    };
    context.dispatch("request", payload, { root: true }).then(response => {
      context.commit("UPDATE_TEAM", response);
    });
  }
};
