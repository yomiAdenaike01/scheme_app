export default {
  deleteChat(context, payload) {
    return new Promise((resolve, reject) => {
      context
        .dispatch(
          "request",
          {
            method: "DELETE",
            url: "messenger/previousChats",
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
  getChatMessages(context, payload) {
    let {
      state: { activeChat }
    } = context;
    let transcriptID = Object.keys(activeChat).length > 0 ? activeChat._id : "";

    return new Promise((resolve, reject) => {
      if (transcriptID.length > 0) {
        context
          .dispatch(
            "request",
            {
              method: "POST",
              url: "messenger/chatMessages",
              data: { transcriptID }
            },
            { root: true }
          )
          .then(response => {
            context.commit("UPDATE_chatMessages", response);
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
          context.commit("UPDATE_previousChats", response);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getChats({ dispatch, commit, state: { previousChats } }) {
    return new Promise((resolve, reject) => {
      if (previousChats.length <= 0) {
        const payload = {
          method: "GET",
          url: "/messenger/chats"
        };
        dispatch("request", payload, { root: true })
          .then(response => {
            if (response.length > 0) {
              commit("UPDATE_PREVIOUS_CHATS", payload);
            }
            resolve(response);
          })
          .catch(error => {
            reject(error);
          });
      }
    });
  }
};
