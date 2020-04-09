import Vue from "vue";
function setActiveChat(state, chat) {
  if (typeof chat == "object") {
    Vue.set(state, "activeChat", chat);
  }
  if (Array.isArray(chat)) {
    Vue.set(state, "activeChat", chat[0]);
  }
}
export default {
  UPDATE_MESSAGES(state, messages) {
    if (typeof messages == "object") {
      state.messages.push(messages);
    }
    if (Array.isArray(messages)) {
      state.messages = messages;
    }
  },

  UPDATE_CHATS(state, payload) {
    if (Array.isArray(payload)) {
      state.chats = payload;
    } else {
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
