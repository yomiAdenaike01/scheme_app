import Vue from "vue";
export default {
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, { event, messages }) {
    if (event == "equal") {
      Vue.set(state, "messages", messages);
    } else {
      Vue.set(state, "messages", [...state.messages, ...messages]);
    }
  },

  UPDATE_TRANSCRIPTS(state, { type, data }) {
    if (type == "all") {
      Vue.set(state, "transcripts", data);
    } else {
      Vue.set(state, "transcripts", [...state.transcripts, ...{ type, data }]);
    }

    //  Think about auto selecting the transcript
  },
  UPDATE_ACTIVE_TRANSCRIPT(state, payload) {
    Vue.set(state, "activeTranscript", payload);
  }
};
