import Vue from "vue";
export default {
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, payload) {
    state.messages = payload;
  },

  UPDATE_TRANSCRIPTS(state, { type, data }) {
    if (type == "all") {
      Vue.set(state, "transcripts", data);
    } else {
      Vue.set(state, "transcripts", [...state.transcripts, ...{ type, data }]);
    }
  },
  UPDATE_ACTIVE_TRANSCRIPT(state, payload) {
    if(!payload){
      Vue.set(state,'activeTranscript',state.transcripts[0]);
    }else{
      Vue.set(state, "activeTranscript", payload);
    }
  }
};
