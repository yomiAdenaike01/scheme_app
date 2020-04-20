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
      index: state.team.length
    });
    state.team.push(payload);
  },
  REMOVE_USER(state, index) {
    updateBreadCrumbs(state, "teamRef", {
      payload: {
        index,
        payload: state.team[index]
      }
    });
    Vue.delete(state.team, index);
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
    for (let i = 0, len = payload.length; i < len; i++) {
      let template = payload[i];
      let templateIndex = state.eventTemplates.findIndex(stateTemplate => {
        return stateTemplate._id == template._id;
      });
      if (templateIndex > -1) {
        state.eventTemplates.push(template);
      }
    }
  },

  UPDATE_EVENT_FILTERS(state, payload) {
    Vue.set(state, "eventFilters", payload);
  },

  UPDATE_EVENTS(state, payload) {
    for (let i = 0, len = payload.length; i < len; i++) {
      let event = payload[i];
      let isDuplicateEvent = state.events.findIndex(payloadEvent => {
        return payloadEvent._id == event._id;
      });
      if (isDuplicateEvent == -1) {
        state.events.push(event);
      }
    }
  },
  CREATE_EVENT(state, payload) {
    // Get the data
    if (!payload?.restore) {
      payload.assignedTo = payload?.assignedTo.map(assignee => {
        return state.team.find(member => {
          return member._id == assignee;
        });
      });

      payload.type = payload.clientEventGroups.find(eventGroup => {
        return eventGroup._id == payload.type;
      });
    }
    let { clientEventGroups, ...eventData } = payload;
    // Push to upcoming
    state.events.push(eventData);
    updateBreadCrumbs(state, "eventRef", {
      index: state.events.length - 1
    });
  },
  UPDATE_EVENT(state, { eventIndex, payload }) {
    let event = state.events[eventIndex];
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      payload: event
    });

    state.events[eventIndex] = {
      ...event,
      ...payload
    };
  },
  DELETE_EVENT(state, { eventIndex = state.events.length - 1 }) {
    let eventAtIndex = state.events[eventIndex];
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      payload: eventAtIndex
    });
    Vue.delete(state.events, eventIndex);
  },
  UPDATE_REQUESTS(state, payload) {
    state.requestsInformation = payload;
  },

  REASSIGN_ELEMENTS(state, { assignment = "team", group }) {
    let groupedElements = [],
      groupKey = assignment == "team" ? "groupID" : "type";
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
    if (Array.isArray(payload) && state.team.length == 0) {
      state.team = payload;
    }
    if (Array.isArray(payload) && state.team.length > 0) {
      for (let i = 0, len = state.team.length; i < len; i++) {
        let teamMember = state.team[i];
        let member = payload.find(payloadMember => {
          return payloadMember._id == teamMember._id;
        });
        if (!member) {
          state.team.push(member);
        }
      }
    }
  },
  ADD_TEAM_MEMBER(state, payload) {
    let isPresent =
      state.team.findIndex(x => {
        return x._id == payload._id || x.name == payload.name;
      }) > -1;
    if (!isPresent) {
      console.log(payload);
      state.team.push(payload);
      console.log(state.team);
      updateBreadCrumbs(state, "teamRef", payload);
    }
  },
  DELETE_TEAM_MEMBER(state, teamMemberIndex) {
    updateBreadCrumbs(state, "teamRef", state.team[teamMemberIndex]);
    Vue.delete(state.team, teamMemberIndex);
  },
  UPDATE_ONE_TEAM_MEMBER(state, { index, payload }) {
    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: state.team[index]
    });
    Vue.set(state.team, index, {
      ...state.team[index],
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
  },
  ADD_USER_TO_EVENT(state, { eventIndex, payload }) {
    state.events[eventIndex].assignedTo.push(payload);
    updateBreadCrumbs(state, "eventRef", {
      userIndex: state.events[eventIndex].assignedTo.length - 1,
      eventIndex
    });
  },
  REMOVE_USER_FROM_EVENT(state, { eventIndex, userIndex }) {
    let user = state.events[eventIndex].assignedTo[userIndex];
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      payload: user
    });
    Vue.delete(state.events[eventIndex].assignedTo, userIndex);
  },

  UPDATE_APPROVE_EVENT(state, { eventIndex, userID }) {
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      userID
    });
    state.events[eventIndex].isApproved.push(userID);
  },
  UPDATE_REJECT_EVENT(state, { eventIndex, userID }) {
    let userIndex = state.events[eventIndex].isApproved.findIndex(index => {
      return index._id == userID;
    });
    updateBreadCrumbs(state, "eventRef", {
      eventIndex,
      userID
    });
    Vue.delete(state.events[eventIndex].isApproved, userIndex);
  }
};
