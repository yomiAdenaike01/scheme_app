export default {
  
  deleteChat(context, payload) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "DELETE",
            url: "messenger/transcripts",
            data: payload
          },
          { root: true }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  readMessages({ dispatch, commit, state: { activeTranscript } }, payload) {
    return new Promise((resolve, reject) => {
      if (Object.keys(activeTranscript).length > 0) {
        dispatch(
          "request",
          {
            method: "POST",
            url: "messenger/read",
            data: { transcriptID: activeTranscript._id }
          },
          { root: true }
        )
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      } else {
        resolve();
      }
    });
  },
  sendMessage(context, payload) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "POST",
            url: "messenger/send",
            data: payload
          },
          { root: true }
        )
        .then(response => {
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  getMessages(context, payload) {
    let {
      state: { activeTranscript }
    } = context;
    let transcriptID =
      Object.keys(activeTranscript).length > 0 ? activeTranscript._id : "";

    return new Promise((resolve, reject) => {
      if (transcriptID.length > 0) {
        context
          .dispatch(
            "request",
            {
              method: "POST",
              url: "messenger/messages",
              data: { transcriptID }
            },
            { root: true }
          )
          .then(response => {
            context.commit("UPDATE_MESSAGES", response);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      } else {
        resolve(["No content"]);
      }
    });
  },
  startChat(context, payload) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          { method: "POST", url: "messenger/start", data: payload },
          { root: true }
        )
        .then(response => {
          context.commit("UPDATE_TRANSCRIPTS", response);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getTranscripts({ dispatch, commit, state: { transcripts } }) {
    return new Promise((resolve, reject) => {
      if (transcripts.length <= 0) {
        const payload = {
          method: "GET",
          url: "/messenger/transcripts"
        };
        dispatch("request", payload, { root: true })
          .then(response => {
            commit("UPDATE_TRANSCRIPTS", {
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
