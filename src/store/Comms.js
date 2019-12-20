export default {
  state: {
    messages: [],
    transcripts: [],
    activeTranscript: '',
    startNewChat: false
  },
  namespaced: true,
  mutations: {
    UPDATE_START_NEW_CHAT(state, payload) {
      state.startNewChat = payload
    },
    UPDATE_MESSAGES(state, payload) {
      if (payload.event == 'equal') {
        state.messages = payload.messages
      } else {
        state.messages.push(payload.messages)
      }
    },
    UPDATE_TRANSCRIPTS(state, payload) {
      if (payload.type == 'all') {
        state.transcripts = payload.data
      } else {
        state.transcripts.push(payload)
      }
    },
    UPDATE_ACTIVE_TRANSCRIPT(state, payload) {
      state.activeTranscript = payload
    }
  },
  actions: {
    getTranscripts(context) {
      const anyTranscripts = context.state.transcripts.length <= 0
      if (anyTranscripts) {
        const payload = {
          method: 'GET',
          url: '/messenger/transcripts'
        }
        context
          .dispatch('request', payload, { root: true })
          .then(response => {
            context.commit('UPDATE_TRANSCRIPTS', {
              data: response,
              type: 'all'
            })
          })
          .catch(error => {
            return error
          })
      }
    }
  }
}
