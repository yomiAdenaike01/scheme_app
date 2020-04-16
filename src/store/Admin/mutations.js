import Vue from "vue";
import updateBreadCrumbs from "../helpers";
/**
 *
 *
 * @param {Object} state
 * @param {string} param
 * @param {Object,string} items
 */

export default {
  // create user
  CREATE_USER(state, payload) {
    updateBreadCrumbs(state, "teamRef", {
      index: state.teamInformation.length
    });
    state.teamInformation.push(payload);
  },
  REMOVE_USER(state, index) {
    Vue.delete(state.teamInformation, index);
  },
  UPDATE_EVENT_TEMPLATES(state, payload) {
    state.eventTemplates = payload;
  },
  CREATE_EVENT_TEMPLATE(state, payload) {
    if (payload.index) {
      let eventTemplate = state.eventTemplates[payload.index];
      state.eventTemplates.splice(payload.index, 1, eventTemplate);
    } else {
      state.eventsTemplates.push(payload);
    }
    updateBreadCrumbs(state, { index: state.eventTemplates.length, payload });
  },
  DELETE_EVENT_TEMPLATE(state, { index }) {
    updateBreadCrumbs(state, { payload: state.eventTemplates[index] });
    Vue.delete(state.eventTemplates, index);
  },
  UPDATE_EVENT_TEMPLATE(state, { index, payload }) {
    updateBreadCrumbs(state, { index, payload: state.eventTemplates[index] });
    let template = state.eventTemplates[index];
    template = Object.assign(payload, template);
  },

  // Reports
  UPDATE_EVENT_FILTERS(state, payload) {
    Vue.set(state, "eventFilters", payload);
  },

  UPDATE_EVENTS(state, payload) {
    Vue.set(state, "eventsInformation", payload);
  },
  CREATE_EVENT(state, payload) {
    // Push to upcoming
    state.eventsInformation.upcoming.push(payload);
    updateBreadCrumbs(state, "eventRef", {
      index: state.eventsInformation.length - 1
    });
  },
  UPDATE_EVENT(state, { eventIndex, eventArray, payload }) {
    let _eventArray = state.eventsInformation[eventArray];
    let eventObject = _eventArray[eventIndex];

    eventObject = {
      ...payload,
      ...eventObject
    };
    updateBreadCrumbs(state, "eventRef", arguments[1]);
  },
  DELETE_EVENT(state, { eventIndex, eventArray }) {
    let eventAtIndex = state.eventsInformation[eventArray][eventIndex],
      events = state.eventsInformation[eventArray];
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      eventArray,
      payload: eventAtIndex
    });
    Vue.delete(events, eventAtIndex);
  },
  UPDATE_REQUESTS(state, payload) {
    state.requestsInformation = payload;
  },

  REASSIGN_ELEMENTS(state, { assignment = "teamInformation", group }) {
    let groupedElements = [],
      groupKey = assignment == "teamInformation" ? "groupID" : "type";
    for (let i = 0, len = state[assignment].length; i < len; i++) {
      let { groupID } = state[assignment][i];
      if (groupID == group) {
        groupedElements.push({ index: i, groupID });
        Vue.set(state[assignment][i], groupKey, 0);
      }
    }
    updateBreadCrumbs(state, "groupRef", { group: group, groupedElements });
  },

  //  Teams
  UPDATE_TEAM(state, payload) {
    if (Array.isArray(payload) && state.teamInformation.length == 0) {
      state.teamInformation = payload;
    }
    if (Array.isArray(payload) && state.teamInformation.length > 0) {
      for (let i = 0, len = state.teamInformation.length; i < len; i++) {
        let teamMember = state.teamInformation[i];
        let member = payload.find(payloadMember => {
          return payloadMember._id == teamMember._id;
        });
        if (!member) {
          state.teamInformation.push(member);
        }
      }
    }
  },
  ADD_TEAM_MEMBER(state, payload) {
    let isPresent =
      state.teamInformation.findIndex(x => {
        return x._id == payload._id || x.name == payload.name;
      }) > -1;
    if (!isPresent) {
      state.teamInformation.push(payload);
      updateBreadCrumbs(state, "teamRef", payload);
    }
  },
  DELETE_TEAM_MEMBER(state, teamMemberIndex) {
    updateBreadCrumbs(state, "teamRef", state.teamInformation[teamMemberIndex]);
    Vue.delete(state.teamInformation, teamMemberIndex);
  },
  UPDATE_ONE_TEAM_MEMBER(state, { index, payload }) {
    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: state.teamInformation[index]
    });
    Vue.set(state.teamInformation, index, {
      ...state.teamInformation[index],
      ...payload
    });
  },

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

  REMOVE_TASK(state, { boardIndex, taskIndex }) {
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

  CLEAR_BREADCRUMBS(state, ref) {
    Vue.set(state, ref, null);
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
    comments.splice(commentIndex, 1);
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
