export default {
  createEvent(context, payload) {
    return new Promise((resolve, reject) => {
      context.commit("CREATE_EVENT", {
        clientevent_groups: context.rootState.clientInformation.event_groups,
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
