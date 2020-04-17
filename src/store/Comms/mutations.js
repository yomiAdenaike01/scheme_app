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
  UPDATE_CHATS(state, payload) {
    payload = Array.isArray(payload) ? payload : [payload];

    if (payload.length > 0) {
      let otherLen = state.chats.length;
      for (let i = 0, len = payload.length; i < len; i++) {
        if (otherLen == 0) {
          state.chats.push(payload[i]);
        } else {
          let foundChat = state.chats.find(chat => {
            return chat._id == payload[i]._id;
          });
          if (!foundChat) {
            state.chats.push(payload[i]);
          }
        }
      }
    }
    setActiveChat(state, state.chats[state.chats.length - 1]);
  },
  UPDATE_MESSAGES(state, payload) {
    state.chats[state.activeChat?.index]?.messages?.push(payload);
  },

  UPDATE_ACTIVE_CHAT(state, payload) {
    setActiveChat(state, !payload ? state.chats : payload);
  },
  DELETE_CHAT(state, index) {
    //Delete the messages
    updateBreadCrumbs(state, "chatRef", { index, chat: state.chats[index] });
    state.messages = [];
    if (index > 0) {
      setActiveChat(state, state.chats[index - 1]);
    } else {
      Vue.set(state, "activeChat", {});
    }
    Vue.delete(state.chats, index);
  }
};
