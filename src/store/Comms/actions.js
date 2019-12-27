export default {
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
