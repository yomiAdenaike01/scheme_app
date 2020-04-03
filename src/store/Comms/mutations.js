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

  UPDATE_TRANSCRIPTS(state, payload) {
    if (Array.isArray(payload) && state.transcripts.length > 0) {
      for (let i = 0, len = payload.length; i < len; i++) {
        let doesTranscriptExist =
          state.transcripts.findIndex(transcript => {
            return transcript == payload._id;
          }) > -1;
        if (!doesTranscriptExist) {
          state.transcripts.push(payload[i]);
        }
      }
    } else if (Array.isArray(payload) && state.transcripts.length == 0) {
      state.transcripts = payload;
    } else if (typeof payload == "object") {
      state.transcripts.push(payload);
    }
    if (payload?.initChat) {
      if (typeof payload == "object") {
        Vue.set(state, "activeTranscript", payload);
      } else {
        Vue.set(state, "activeTranscript", payload[0]);
      }
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
