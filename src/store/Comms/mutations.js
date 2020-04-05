import Vue from "vue";
const setActiveChat = (state, chat) => {
  if (typeof chat == "object") {
    Vue.set(state, "activeChat", chat);
  } else {
    Vue.set(state, "activeChat", chat[0]);
  }
};
export default {
  UPDATE_MESSAGES(state, messages) {
    if (typeof messages == "object") {
      let queriedMessage = state.messages.findIndex(message => {
        return message._id == messages._id;
      });
      if (queriedMessage == -1) {
        state.messages.push(messages);
      }
    } else {
      state.messages = messages;
    }
  },

  UPDATE_CHATS(state, payload) {
    if (Array.isArray(payload) && state.chats.length > 0) {
      for (let i = 0, len = payload.length; i < len; i++) {
        let doesChatExist =
          state.chats.findIndex(chat => {
            return chat == payload._id;
          }) > -1;
        if (!doesChatExist) {
          state.chats.push(payload[i]);
        }
      }
    }
    if (Array.isArray(payload) && state.chats.length == 0) {
      console.log(payload);
      Vue.set(state, "chats", payload);
    }
    if (typeof payload == "object") {
      state.chats.push(payload);
    }
    setActiveChat(state, payload);
  },
  UPDATE_SCROLL_POSITION(state, elem) {
    // get the scoll position and set it
    Vue.set(state, "activeChatScrollPosition", elem);
  },
  UPDATE_ACTIVE_CHAT(state, payload) {
    setActiveChat(state, !payload ? state.chats : payload);
  }
};
