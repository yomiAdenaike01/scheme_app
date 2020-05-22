import updateBreadCrumbs from "../helpers";

export default {
  UPDATE_BOARDS(state, { data, action = "update" }) {
    // Update board at an index and create a reference
    if (action == "update") {
      if (Array.isArray(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          let apiBoard = data[i];

          // If the board is not local then add it
          let foundBoard = state.boards.find(board => {
            return board._id == apiBoard._id;
          });

          if (!foundBoard) {
            state.boards.splice(i, 1, apiBoard);
          } else {
            // Push the tasks that arent there
            let localBoardTasks = state.boards[i].tasks;
            let apiBoardTasks = apiBoard.tasks;

            apiBoardTasks.map(apiTask => {
              let apiTaskIndex = localBoardTasks.findIndex(
                x => x._id == apiTask._id
              );
              if (apiTaskIndex == -1) {
                localBoardTasks.push(apiBoardTasks[apiTaskIndex]);
              }
            });
            state.boards[i].tasks = apiBoard.tasks;
          }
        }
      } else {
        let { name, description } = data;

        let boardIndex = data.boardIndex;

        if (state.boards[boardIndex]) {
          state.boards.push(data);
        } else {
          state.boardRef = state.boards[boardIndex];
          state.boards.splice(boardIndex, 0, {
            name,
            description
          });
        }
      }
    } else {
      // Push a new board this is so that it can be removed if the creation goes wrong
      let boardIndex = state.boards.length - 1;
      let { name, description, _id } = data;
      updateBreadCrumbs(state, "boardRef", { boardIndex, ...data });
      state.boards.push({ name, description, _id, tasks: [] });
    }
  },
  CREATE_TASK(state, data) {
    let { boardIndex } = data;
    // Create task for board at index

    state.boards[boardIndex].tasks.push(data);
    // Create ref for created task
    updateBreadCrumbs(state, "taskRef", {
      boardIndex,
      taskIndex: state.boards[boardIndex].tasks.length - 1
    });
  },

  UPDATE_TASKS(state, payload) {
    let { boardIndex, taskIndex, update } = payload;
    // Update task at index
    let tasks = state.boards[boardIndex].tasks;
    let task = tasks[taskIndex];

    updateBreadCrumbs(state, "taskRef", { boardIndex, task, taskIndex });

    tasks.splice(taskIndex, 1, update);
    console.log(task);
  },

  DELETE_TASK(state, { boardIndex, taskIndex }) {
    let tasks = state.boards[boardIndex].tasks,
      task = tasks[taskIndex];

    updateBreadCrumbs(state, "taskRef", {
      boardIndex,
      taskIndex,
      task
    });

    tasks.splice(taskIndex, 1);
  },

  DELETE_BOARD(state, boardIndex) {
    updateBreadCrumbs(state, "boardRef", {
      boardIndex,
      board: state.boards[boardIndex]
    });
    state.boards.splice(boardIndex, 1);
  },

  RESTORE_BOARD(state) {
    state.boards.splice(state.boardRef.boardIndex, 0, state.boardRef.board);
  }
};
