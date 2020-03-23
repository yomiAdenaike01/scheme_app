import Vue from "vue";
export default {
  UPDATE_TRANSCRIPT_LOADING(state, payload = false) {
    state.transcriptLoading = payload;
  },
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, payload) {
    state.messages = payload;
  },

  UPDATE_TRANSCRIPTS(state, { type, data }) {
    if (type == "all") {
      state.transcripts = data;
    } else {
      state.transcripts = [...state.transcripts, ...{ type, data }];
    }
  },
  UPDATE_ACTIVE_TRANSCRIPT(state, payload) {
    if (!payload) {
      Vue.set(state, "activeTranscript", state.transcripts[0]);
    } else {
      Vue.set(state, "activeTranscript", payload);
    }
  }
};
