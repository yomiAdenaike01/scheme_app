function updateboard_quota(commit, state, action = "minus") {
  let value = state.clientInformation.board_quota + 1;
  if (action == "minus") {
    state.clientInformation.board_quota - 1;
  }
  commit(
    "UPDATE_CLIENT_INFORMATION",
    {
      action: "update",
      key: "board_quota",
      value
    },
    { root: true }
  );
}
export default {
  /**
   * @description get boards
   * @param {object} context
   */
  getBoards(context) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "GET",
            url: "tasks/boards"
          },
          { root: true }
        )
        .then(response => {
          context.commit("UPDATE_BOARDS", { data: response, action: "update" });
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**
   * @param {object} { dispatch, commit, rootState }
   * @param {object} payload {boardID}
   */
  deleteBoard({ dispatch, commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      dispatch(
        "genPromptBox",
        {
          boxType: "confirm",
          text: "Are you sure you want to delete this board ?",
          title: "Delete Board"
        },
        { root: true }
      ).then(() => {
        commit("DELETE_BOARD", payload.boardIndex);
        updateboard_quota(commit, rootState, "plus");
        dispatch(
          "request",
          {
            method: "DELETE",
            url: "tasks/boards/delete",
            data: { _id: payload.boardID }
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            commit("UPDATE_BOARDS", { data: payload, action: "create" });
            commit("DELETE_BOARD", payload.boardID);
            updateboard_quota(commit, rootState, "minus");
            reject();
          });
      });
    });
  },

  /**
   * @param {object} { dispatch, commit, rootState }
   * @param {object} payload
   */
  createBoard({ dispatch, commit, rootState }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_BOARDS", { data: payload, action: "create" });
      updateboard_quota(commit, rootState, "minus");
      let { _id, ...data } = payload;

      payload = {
        data,
        method: "POST",
        url: "tasks/boards/create"
      };

      dispatch("request", payload, { root: true })
        .then(() => {
          resolve();
        })
        .catch(() => {
          commit("DELETE_BOARD", payload.boardID);
          updateboard_quota(commit, rootState, "plus");
          reject();
        });
    });
  },

  /**
   * @param {object} { dispatch, commit }
   * @param {object} payload
   */
  updateBoard({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_BOARDS", { action: "update", ...payload });
      payload = {
        data: { ...payload },
        method: "PUT",
        url: "tasks/boards/update"
      };

      dispatch("request", payload, { root: true })
        .then(() => {
          resolve();
        })
        .catch(() => {
          commit("RESTORE_BOARD");
          reject();
        });
    });
  },

  /**
   * @param {object} { dispatch, commit }
   * @param {object} payload {boardIndex, name, description, date_time, labels, comments, completedDate (optional), assigned_to (optional)}
   */
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

  /**
   * @param {object} { dispatch, commit }
   * @param {object} payload
   */
  updateTask({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_TASKS", payload);
      payload = { method: "PUT", url: "tasks/update", data: payload };

      dispatch("request", payload, { root: true })
        .then(resolve)
        .catch(reject);
    });
  },

  /**
   * @param {object} { dispatch, commit }
   * @param {object} payload
   */
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
