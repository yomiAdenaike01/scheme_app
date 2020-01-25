import Vue from "vue";
export default {
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, payload) {
    if (payload.event == "equal") {
      Vue.set(state, "messages", payload["messages"]);
    } else {
      Vue.set(state, "messages", [...state.messages, ...payload["messages"]]);
    }
  },

  UPDATE_TRANSCRIPTS(state, payload) {
    if (payload.type == "all") {
      Vue.set(state, "transcripts", payload["data"]);
    } else {
      Vue.set(state, "transcripts", [...state.transcripts, ...payload]);
    }

    //  Think about auto selecting the transcript
  },
  UPDATE_ACTIVE_TRANSCRIPT(state, payload) {
    Vue.set(state, "activeTranscript", payload);
  }
};
