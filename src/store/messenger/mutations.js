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
    let newChat = state.chats.find(chat => {
      return chat.initChat;
    });

    let activeChat = state.activeChat;

    if (newChat) {
      state.chats = [...payload, newChat];
    } else {
      state.chats = payload;
    }

    if (payload.length > 0) {
      state.activeChat = {};

      if (Object.values(state.activeChat).length == 0) {
        let lastChatIndex = state.chats.length - 1;
        let lastChat = state.chats[lastChatIndex];

        setActiveChat(state, lastChat);
      } else {
        // Update active chat messages
        let activeChatInApi = payload.find(chat => {
          return chat._id == state.activeChat._id;
        });
        if (activeChatInApi) {
          activeChat.messages = activeChatInApi.messages;
        }
      }
    }
  },

  UPDATE_CHAT(state, payload) {
    let chatIndex = state.chats.findIndex(chat => {
      return chat._id == payload._id;
    });
    if (chatIndex > -1) {
      let foundChat = state.chats[chatIndex];
      for (let property in payload) {
        Vue.set(foundChat, property, payload[property]);
      }
    }
  },
  CREATE_CHAT(state, payload) {
    state.chats.push(payload);
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
