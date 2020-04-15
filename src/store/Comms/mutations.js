import Vue from "vue";
import updateBreadCrumbs from "../helpers";

function setActiveChat(state, chat) {
  if (typeof chat == "object") {
    state.activeChat = chat;
  }
  if (Array.isArray(chat)) {
    state.activeChat = chat[0];
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

  UPDATE_ACTIVE_CHAT(state, payload) {
    setActiveChat(state, !payload ? state.chats : payload);
  },
  DELETE_CHAT(state, index) {
    //Delete the messages
    updateBreadCrumbs(state, "chatRef", { index, chat: state.chats[index] });
    state.messages = [];
    if (state.chats[index - 1]) {
      setActiveChat(state, state.chats[index - 1]);
    }
    Vue.delete(state.chats, index);
  }
};
