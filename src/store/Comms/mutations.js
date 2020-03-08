import Vue from "vue";
export default {
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, payload) {
    Vue.set(state, "messages", payload);
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
