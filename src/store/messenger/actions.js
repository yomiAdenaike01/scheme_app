import genID from "@/mixins/genID";
export default {
  createStubChat(context) {
    let methods = genID.methods;
    let isoDate = new Date().toISOString();
    context.commit("UPDATE_CHATS", {
      muted_notifications: [],
      user_one: {
        name: context.rootState.userInformation.name,
        _id: context.rootState.userInformation._id
      },
      user_two: {
        name: "New message",
        _id: methods.genID()
      },
      date_created: isoDate,
      date_updated: isoDate,
      initChat: true,
      _id: methods.genID(),
      messages: [],
      index: context.state.chats.length
    });
    let lastChatIndex = context.state.chats.length - 1;
    context.commit("UPDATE_ACTIVE_CHAT", {
      index: lastChatIndex,
      ...context.state.chats[lastChatIndex]
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
    let chat_id =
      Object.keys(activeChat).length > 0 && !activeChat?.initChat
        ? activeChat._id
        : "";

    return new Promise((resolve, reject) => {
      if (chat_id.length > 0) {
        dispatch(
          "request",
          {
            method: "POST",
            url: "messenger/messages",
            data: { chat_id }
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
  startChat({ dispatch, commit, state: { chats } }, payload) {
    return new Promise((resolve, reject) => {
      dispatch(
        "request",
        { method: "POST", url: "messenger/start", data: payload },
        { root: true }
      )
        .then(response => {
          commit("DELETE_CHAT", chats.length - 1);
          commit("UPDATE_CHATS", response);
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
