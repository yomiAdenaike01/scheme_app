export default {
  deleteChat({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        {
          method: "DELETE",
          url: "messenger/chats",
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

  sendMessage({ state, dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      let activeChat = state.activeChat;
      if (activeChat?.initChat) {
        dispatch("startChat", payload);
      }
      // Add fake message
      commit("UPDATE_MESSAGES", payload);
      dispatch(
        "request",
        {
          method: "POST",
          url: "messenger/send",
          data: payload
        },
        { root: true }
      ).catch(() => reject());
    });
  },
  getChatMessages({ state: { activeChat }, dispatch, commit }) {
    let chatID =
      Object.keys(activeChat).length > 0 && !activeChat?.initChat
        ? activeChat._id
        : "";

    return new Promise((resolve, reject) => {
      if (chatID.length > 0) {
        dispatch(
          "request",
          {
            method: "POST",
            url: "messenger/messages",
            data: { chatID }
          },
          { root: true }
        )
          .then(response => {
            commit("UPDATE_MESSAGES", response);
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
  startChat({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        { method: "POST", url: "messenger/start", data: payload },
        { root: true }
      )
        .then(response => {
          commit("UPDATE_CHATS", response);
          dispatch("getChats");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  getChats({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      const payload = {
        method: "GET",
        url: "/messenger/chats"
      };
      dispatch("request", payload, { root: true })
        .then(response => {
          if (response.length > 0) {
            commit("UPDATE_CHATS", response);
            resolve(response);
          }
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
