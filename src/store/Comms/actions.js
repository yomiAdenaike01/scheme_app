export default {
  deleteChat(context,payload){
    return new Promise((resolve,reject)=>{
      context.dispatch('request',{
        method:'DELETE',
        url:'messenger/transcripts',
        data:payload
      },{root:true}).then(response=>{
        resolve(response);
      }).catch(error=>{
        reject(error);
      })
    })
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
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          { method: "POST", url: "messenger/messages", data: payload },
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
  getTranscripts(context) {
    let {transcripts} = context.state;
    if(transcripts.length <= 0){
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
}
};
