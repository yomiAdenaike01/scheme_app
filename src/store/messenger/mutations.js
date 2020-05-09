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
          } else {
            // check the messages
            let payloadMessages = payload[i].messages;
            let stateMessages = state.chats[i].messages;
            // check whether the payload has more messages
            payloadMessages.map(sMessage => {
              let foundPMessage = stateMessages.find(pMessage => {
                return (
                  pMessage.content.toLowerCase().trim() ==
                  sMessage.content.toLowerCase().trim()
                );
              });

              if (!foundPMessage) {
                state.chats[i].messages.push(sMessage);
              }
            });
          }
        }
      }
    }
    if (Object.values(state.activeChat).length == 0) {
      setActiveChat(state, {
        index: state.chats.length - 1,
        ...state.chats[state.chats.length - 1]
      });
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
  },
  CLEAR_ACTIVE_CHAT(state) {
    state.activeChat = {};
  }
};
