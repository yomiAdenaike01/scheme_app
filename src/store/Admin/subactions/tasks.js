function updateBoardQuota(commit, value) {
  commit(
    "UPDATE_CLIENT_INFORMATION",
    {
      action: "update",
      key: "boardQuota",
      value
    },
    { root: true }
  );
}
export default {
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

  deleteBoard(
    {
      dispatch,
      commit,
      rootState: {
        clientInformation: { boardQuota }
      }
    },
    payload
  ) {
    return new Promise((resolve, reject) => {
      commit("DELETE_BOARD", payload.boardID);
      updateBoardQuota(commit, boardQuota + 1);
      payload = {
        data: { ...payload },
        method: "DELETE",
        url: "tasks/boards/delete"
      };
      dispatch(
        "genPromptBox",
        {
          boxType: "confirm",
          text: "Are you sure you want to delete this board ?",
          title: "Delete Board"
        }.then(() => {
          dispatch("request", payload, { root: true })
            .then(() => {
              resolve();
            })
            .catch(() => {
              commit("UPDATE_BOARDS", { data: payload, action: "create" });
              commit("DELETE_BOARD", payload.boardID);
              updateBoardQuota(commit, boardQuota - 1);
              reject();
            });
        }),
        { root: true }
      );
    });
  },
  createBoard(
    {
      dispatch,
      commit,
      rootState: {
        clientInformation: { boardQuota }
      }
    },
    payload
  ) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_BOARDS", { data: payload, action: "create" });
      updateBoardQuota(commit, boardQuota - 1);

      payload = {
        data: { ...payload },
        method: "POST",
        url: "tasks/boards/create"
      };

      dispatch("request", payload, { root: true })
        .then(() => {
          resolve();
        })
        .catch(() => {
          commit("DELETE_BOARD", payload.boardID);
          updateBoardQuota(commit, boardQuota + 1);
          reject();
        });
    });
  },
  updateBoard({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_BOARD", payload);
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

  createTask({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_TASKS", payload);
      payload = { method: "POST", url: "tasks/create", data: { ...payload } };

      dispatch("request", payload, { root: true })
        .then(response => {
          commit("UPDATE_TASKS", { data: response, action: "create" });
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  updateTask({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("UPDATE_TASKS", { ...payload, action: "update" });
      payload = { method: "PUT", url: "tasks/update", data: { ...payload } };

      dispatch("request", payload, { root: true })
        .then(response => {
          commit("UPDATE_TASKS", { data: response, action: "update" });
          resolve();
        })
        .catch(() => {
          reject();
        });
    });
  },
  deleteTask({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      commit("REMOVE_TASK", payload);
      payload = {
        method: "DELETE",
        url: "tasks/delete",
        data: { _id: payload.taskID }
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
