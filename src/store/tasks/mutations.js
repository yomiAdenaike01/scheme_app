import updateBreadCrumbs from "../helpers";
import Vue from "vue";

export default {
  UPDATE_BOARDS(state, { data, action = "update" }) {
    // Update board at an index and create a reference
    if (action == "update") {
      if (Array.isArray(data)) {
        for (let i = 0, len = data.length; i < len; i++) {
          let apiBoard = data[i];
          let foundBoard = state.boards.find(board => {
            return board._id == apiBoard._id;
          });
          if (!foundBoard) {
            state.boards.splice(i, 1, apiBoard);
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
    let task = state.boards[boardIndex].tasks[taskIndex];
    updateBreadCrumbs(state, "taskRef", { boardIndex, task, taskIndex });

    state.boards[boardIndex].tasks[taskIndex] = {
      ...task,
      ...update
    };
    console.log(task, update);
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
  },
  CREATE_COMMENT(state, { taskIndex, boardIndex, commentIndex = 0, data }) {
    let comments = state.boards[boardIndex].tasks[taskIndex].comments;
    updateBreadCrumbs(state, "commentsRef", {
      taskIndex,
      boardIndex,
      commentIndex: comments.length - 1
    });
    if (commentIndex == 0) {
      comments.push(data);
    } else {
      comments.splice(commentIndex, 0, data);
    }
  },
  UPDATE_COMMENT(state, payload) {
    let { update, boardIndex, taskIndex } = payload;
    let comments = state.boards[boardIndex].tasks[taskIndex].comments;

    if (!payload?.commentIndex) {
      var commentIndex = comments.length - 1;
    }
    comments.splice(commentIndex, 1, update);
    updateBreadCrumbs(state, "commentRef", {
      boardIndex,
      taskIndex,
      commentIndex,
      data: update
    });
  },
  DELETE_COMMENT(state, { boardIndex, taskIndex, commentIndex }) {
    let comment =
        state.boards[boardIndex].tasks[taskIndex]?.comments[commentIndex],
      comments = state.boards[boardIndex].tasks[taskIndex].comments;
    updateBreadCrumbs(state, "commentsRef", {
      boardIndex,
      taskIndex,
      commentIndex,
      data: comment
    });
    Vue.delete(comments, commentIndex);
  },

  //  Labels
  CREATE_LABEL(state, { boardIndex, taskIndex, data = state.labelRef?.label }) {
    let labels = state.boards[boardIndex].tasks[taskIndex].labels;
    labels.push(data);
    updateBreadCrumbs(state, "labelRef", {
      boardIndex,
      taskIndex,
      labelIndex: labels.length - 1
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
    let { boardIndex, taskIndex } = state.labelRef,
      labels = state.boards[boardIndex].tasks[taskIndex].labels,
      label = labels[labelIndex];
    updateBreadCrumbs(state, "labelRef", {
      boardIndex,
      taskIndex,
      label
    });
    labels.splice(labelIndex, 1);
  }
};
