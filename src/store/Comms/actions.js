export default {
  getTranscripts(context) {
    return new Promise((resolve, reject) => {
      const anyTranscripts = context.state.transcripts.length <= 0;
      if (anyTranscripts) {
        const payload = {
          method: "GET",
          url: "/messenger/transcripts"
        };
        context
          .dispatch("request", payload, { root: true })
          .then(response => {
            context.commit("UPDATE_TRANSCRIPTS", {
              data: response,
              type: "all"
            });
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }
};
