import Vue from "vue";

/**
 *
 * @param {String} findQuery
 * @param {Object} state
 * @param {String} param
 * @param {String} id
 * @param {String} query
 */
function findItemIndex(state, param = "boards", id) {
  return state[param].findIndex(item => {
    return item._id == id;
  });
}

function setRef(state, param, items) {
  if (items) {
    state[param] = {
      ...items
    };
  } else {
    state[param] = items;
  }
}

export default {
  UPDATE_EVENT_TEMPLATES(state, payload) {
    Vue.set(state, "eventTemplates", payload);
  },
  // Reports
  UPDATE_EVENT_FILTERS(state, payload) {
    Vue.set(state, "eventFilters", payload);
  },

  UPDATE_EVENTS(state, payload) {
    Vue.set(state, "eventsInformation", payload);
  },
  UPDATE_REQUESTS(state, payload) {
    state.requestsInformation = payload;
  },
  UPDATE_TEAM(state, payload) {
    Vue.set(state, "teamInformation", payload);
  },
  /**
   * @description create or update a board at an index references created to restore later
   * @param {*} state
   * @param {Object} boardID (update) boardIndex, name , description (create)
   * @param {String} action
   * @param {String} action
   */
  UPDATE_BOARDS(state, { data, action = "update" }) {
    // Update board at an index and create a reference
    if (action == "update") {
      if (Array.isArray(data)) {
        state.boards = data;
      }
      if (typeof data == "object") {
        let { boardID, name, description } = data;
        let boardIndex = findItemIndex(state, null, boardID);
        if (boardIndex == -1) {
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
      setRef(state, "boardRef", { boardIndex, ...data });
      state.boards.push({ name, description, _id, tasks: [] });
    }
  },
  /**
   *
   * @param {*} state
   * @param {Object} boardID, taskID, update
   */
  UPDATE_TASKS(state, { data, action = "update" }) {
    let { boardID, taskID, update } = data;
    let boardIndex = findItemIndex(state, null, boardID);
    if (action == "update") {
      let taskIndex = findItemIndex(state, "boards"[boardIndex].tasks, taskID);
      let task = state.boards[boardIndex].tasks[taskIndex];
      setRef(state, "taskRef", { boardIndex, task, taskIndex });

      state.boards[boardIndex].tasks[taskIndex] = {
        ...task,
        ...update
      };
    } else {
      // Create task for board at index
      state.boards[boardIndex].tasks.push(data);
      // Create ref for created task
      setRef(state, "taskRef", {
        boardIndex,
        taskIndex: state.boards[boardIndex].tasks.length
      });
    }
  },
  /**
   * @description remove task from board and create a reference to restore later if an error occurs
   * @param {*} state
   * @param {Object} boardID, taskID
   */
  REMOVE_TASK(state, { boardID, taskID }) {
    let boardIndex = findItemIndex(state, null, boardID);
    let taskIndex = findItemIndex(state, "boards"[boardIndex].tasks, taskID);
    setRef(state, "taskRef", {
      boardIndex,
      taskIndex,
      task: state.boards[boardIndex].tasks[taskIndex]
    });
    state.boards[boardIndex].tasks.splice(taskIndex, 1);
  },
  /**
   *@description delete board at index create a ref to restore if fails
   * @param {*} state
   * @param {String} boardID
   */
  DELETE_BOARD(state, boardID) {
    let boardToDeleteIndex = findItemIndex(state, "boards", boardID);

    setRef(state, "boardRef", {
      boardIndex: boardToDeleteIndex,
      board: state.boards[boardToDeleteIndex]
    });
    state.boards.splice(boardToDeleteIndex, 1);
  },

  /**
   * @description restore a board at a given index
   * @param {*} state
   */
  RESTORE_BOARD(state) {
    state.boards.splice(state.boardRef.boardIndex, 0, state.boardRef.board);
  },
  /**
   *
   * @param {*} state
   * @param {String} ref
   * @description Clear the restore referecence for the give key in state
   */
  CLEAR_REFERENCE(state, ref) {
    setRef(state, ref, null);
  }
};
