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
    // Keep a copy of a new chat
    let newChatCopy = state.chats.find(chat => {
      return chat.initChat;
    });

    if (newChatCopy) {
      state.chats = [...payload, newChatCopy];
    } else {
      state.chats = payload;
    }

    if (Object.values(state.activeChat).length == 0) {
      setActiveChat(state, {
        index: state.chats.length - 1,
        ...state.chats[state.chats.length - 1]
      });
    } else {
      // Update active chat messages
      let activeChatInApi = payload.find(chat => {
        return chat._id == state.activeChat._id;
      });
      if (activeChatInApi) {
        state.activeChat.messages = activeChatInApi.messages;
      }
    }
  },
  UPDATE_MESSAGES(state, payload) {
    let chatIndex = state.activeChat.index;
    state.chats[chatIndex].messages.push(payload);
    updateBreadCrumbs(state, "messageRef", {
      messageIndex: state.chats[chatIndex].messages.length - 1,
      chatIndex
    });
  },

  UPDATE_ACTIVE_CHAT(state, payload) {
    setActiveChat(state, !payload ? state.chats : payload);
  },
  DELETE_CHAT(state, index) {
    //Delete the messages
    updateBreadCrumbs(state, "chatRef", { index, chat: state.chats[index] });
    state.messages = [];
    if (index > 0) {
      setActiveChat(state, { index: index - 1, ...state.chats[index - 1] });
    } else {
      state.activeChat = {};
    }
    Vue.delete(state.chats, index);
  }
};
