export default {
  createTask({ state, dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("CREATE_TASK", payload.mutationData);
      payload = {
        method: "POST",
        url: "tasks/create",
        data: { ...payload.requestBody }
      };
      dispatch("request", payload, { root: true })
        .then(() => {
          resolve();
        })
        .catch(() => {
          commit("REMOVE_TASK", {
            ...state.commentRef
          });
          reject();
        });
    });
  },

  updateTask({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_TASKS", payload);
      payload = { method: "PUT", url: "tasks/update", data: payload };

      dispatch("request", payload, { root: true })
        .then(resolve)
        .catch(reject);
    });
  },

  deleteTask({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("REMOVE_TASK", payload);
      payload = {
        method: "DELETE",
        url: "tasks/delete",
        data: { _id: payload._id }
      };
      dispatch("request", payload, { root: true })
        .then(() => {
          resolve();
        })
        .catch(() => {
          commit("UPDATE_TASK", payload);
          reject();
        });
    });
  }
};
