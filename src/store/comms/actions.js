import genID from "@/mixins/genID";
export default {
  createStubChat(context) {
    let methods = genID.methods;
    let isoDate = new Date().toISOString();
    let userInfo = context.rootState.userInformation;
    context.commit("CREATE_CHAT", {
      muted_notifications: [],
      user_one: {
        name: userInfo.name,
        _id: userInfo._id
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
      commit("UPDATE_ACTIVE_CHAT_MESSAGES", payload);

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
            commit("UPDATE_ACTIVE_CHAT_MESSAGES", response);
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
          commit("REPLACE_STUB_CHAT", response);
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
          commit("UPDATE_CHATS", response);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};
