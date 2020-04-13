import Vue from "vue";

/**
 *
 * @param {string} findQuery
 * @param {Object} state
 * @param {string} param
 * @param {string} id
 * @param {string} query
 */
function findItemIndex(state, param = "boards", id) {
  return state[param].findIndex(item => {
    return item._id == id;
  });
}

/**
 *
 *
 * @param {Object} state
 * @param {string} param
 * @param {Object,string} items
 */
function updateBreadCrumbs(state, param, items) {
  if (items) {
    state[param] = {
      ...items
    };
  } else {
    state[param] = items;
  }
}

export default {
  CREATE_EVENT_TEMPLATE(state, payload) {
    state.eventTemplates.push(payload);
    updateBreadCrumbs(state, "templateRef", {
      templateIndex: state.eventTemplates.length,
      template: payload
    });
  },
  DELETE_EVENT_TEMPLATE(state, payload) {
    let templateIndex = findItemIndex(
      state,
      "eventTemplates",
      payload.templateID
    );
    updateBreadCrumbs(state, "templateRef", {
      template: state.eventTemplates[templateIndex],
      templateIndex
    });
  },
  /**
   *
   * @param {Object} state
   * @param {String} payload (push , pull, update)
   */
  RESTORE_EVENT_TEMPLATE(state, payload = "push") {
    if (payload == "push") {
      state.eventTemplates.push(state.templateRef.template);
    }
    if (payload == "pull") {
      state.eventTemplates.splice(state.templateRef.templateIndex, 1);
    }
    if (payload == "update") {
      state.eventTemplates.splice(
        state.templateRef.templateIndex,
        0,
        state.templateRef.template
      );
    }
  },
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
   * @param {Object} state
   * @param {Object} boardID (update) boardIndex, name , description (create)
   * @param {String} action
   * @param {String} action
   */
  UPDATE_BOARDS(state, { data, action = "update" }) {
    // Update board at an index and create a reference
    if (action == "update") {
      if (Array.isArray(data)) {
        state.boards = data;
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
  /**
   *
   * @param {*} state
   * @param {Object} boardID, taskID, update, action
   */
  UPDATE_TASKS(state, payload) {
    let { boardIndex, taskIndex, update } = payload;

    // Update task at index
    let task = state.boards[boardIndex].tasks[taskIndex];
    updateBreadCrumbs(state, "taskRef", { boardIndex, task, taskIndex });

    state.boards[boardIndex].tasks[taskIndex] = {
      ...task,
      ...update
    };
    console.log(task, update);
  },
  /**
   * @description remove task from board and create a reference to restore later if an error occurs
   * @param {*} state
   * @param {Object} boardIndex, taskIndex
   */
  REMOVE_TASK(state, { boardIndex, taskIndex }) {
    updateBreadCrumbs(state, "taskRef", {
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
  DELETE_BOARD(state, boardIndex) {
    updateBreadCrumbs(state, "boardRef", {
      boardIndex,
      board: state.boards[boardIndex]
    });
    state.boards.splice(boardIndex, 1);
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
    updateBreadCrumbs(state, ref, null);
  },

  /**
   *
   *
   * @param {*} state
   * @param {*} { taskIndex, boardIndex, data }
   */
  CREATE_COMMENT(state, { taskIndex, boardIndex, data }) {
    updateBreadCrumbs(state, "commentsRef", {
      taskIndex,
      boardIndex,
      commentIndex:
        state.boards[boardIndex].tasks[taskIndex].comments.length - 1
    });
    console.log(data);
    state.boards[boardIndex].tasks[taskIndex]?.comments.push(data);
  },

  /**
   *
   * @param {*} state
   * @param {*} { boardIndex, taskIndex, commentIndex }
   */
  REMOVE_COMMENT(state, { boardIndex, taskIndex, commentIndex }) {
    let comment =
      state.boards[boardIndex].tasks[taskIndex]?.comments[commentIndex];
    updateBreadCrumbs(state, "commentsRef", {
      boardIndex,
      taskIndex,
      commentIndex,
      comment
    });
    state.boards[boardIndex].tasks[taskIndex].comments.splice(commentIndex, 1);
  },

  //  Labels
  CREATE_LABEL(state, { boardIndex, taskIndex, data = state.labelRef?.label }) {
    state.boards[boardIndex].tasks[taskIndex].labels.push(data);
    updateBreadCrumbs(state, "labelRef", {
      boardIndex,
      taskIndex,
      labelIndex: state.boards[boardIndex].tasks[taskIndex].labels.length - 1
    });
  },
  UPDATE_LABEL(state, { boardIndex, taskIndex, data }) {
    let tasks = state.boards[boardIndex].tasks[taskIndex];
    updateBreadCrumbs(state, "labelRef", { ...arguments[1] });
    tasks.labels.splice(data.labelIndex, 0, {
      ...data
    });
  },
  REMOVE_LABEL(state, labelIndex = state.labelRef.labelIndex) {
    let { boardIndex, taskIndex } = state.labelRef;
    updateBreadCrumbs(state, "labelRef", {
      boardIndex,
      taskIndex,
      label: state.boards[boardIndex].tasks[taskIndex].labels[labelIndex]
    });
    state.boards[boardIndex].tasks[taskIndex].labels.splice(labelIndex, 1);
  }
};
