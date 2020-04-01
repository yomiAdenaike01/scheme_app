export default {
  getTaskBoards(context) {
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
          context.commit("UPDATE_TASK_BOARDS", response);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  createTask() {},
  updateTask() {},
  deleteTask() {}
};
