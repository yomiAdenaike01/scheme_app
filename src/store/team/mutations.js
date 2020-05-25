import updateBreadCrumbs from "../helpers";
import Vue from "vue";

export default {
  CREATE_TEAM_MEMBER(state, payload) {
    let teamMemberIndex = state.team.findIndex(x => {
      return x.email == payload.email;
    });
    if (teamMemberIndex == -1) {
      state.team.push(payload);
      updateBreadCrumbs(state, "teamRef", {
        payload,
        index: state.team.length - 1
      });
    }
  },

  DELETE_TEAM_MEMBER(state, teamMemberIndex) {
    teamMemberIndex = teamMemberIndex ? teamMemberIndex : state.team.length - 1;

    updateBreadCrumbs(state, "teamRef", state.team[teamMemberIndex]);
    state.team.splice(teamMemberIndex, 1);
  },
  UPDATE_TEAM(state, payload) {
    if (Array.isArray(payload) && state.team.length == 0) {
      state.team = payload;
    }
    if (Array.isArray(payload) && state.team.length > 0) {
      for (let i = 0, len = payload; i < len; i++) {
        let teamMember = payload[i];
        let member = state.team.find(payloadMember => {
          return payloadMember._id == teamMember._id;
        });
        if (!member) {
          state.team.push(teamMember);
        } else {
          state.team.splice(i, 1, member);
        }
      }
    }
  },

  UPDATE_ONE_TEAM_MEMBER(state, { index, payload }) {
    let teamMember = state.team[index];

    updateBreadCrumbs(state, "teamRef", {
      index,
      payload: teamMember
    });

    for (let property in payload) {
      let updatedVal = payload[property];
      if (teamMember[property]) {
        Vue.set(teamMember, property, updatedVal);
      }
    }
  }
};
