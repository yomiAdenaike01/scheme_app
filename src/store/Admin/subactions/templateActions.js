export default {
  getTemplates({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        {
          method: "GET",
          url: "events/templates"
        },
        { root: true }
      )
        .then(response => {
          commit("UPDATE_EVENT_TEMPLATES", response);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createEventTemplate({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        {
          method: "POST",
          url: "events/templates/create",
          data: payload
        },
        { root: true }
      )
        .then(() => {
          dispatch("getTemplates");
        })
        .catch(() => {});
    });
  }
};
