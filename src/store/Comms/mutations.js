export default {
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, payload) {
    if (payload.event == "equal") {
      state.messages = payload.messages;
    } else {
      state.messages.push(payload.messages);
    }
  },
  
  UPDATE_TRANSCRIPTS(state, payload) {
    if (payload.type == "all") {
      state.transcripts = payload.data;
    } else {
      state.transcripts.push(payload);
    }

    //  Think about auto selecting the transcript
  },
  UPDATE_ACTIVE_TRANSCRIPT(state, payload) {
    state.activeTranscript = payload;
  }
};
