import Vue from "vue";
export default {
  UPDATE_START_NEW_CHAT(state, payload) {
    state.startNewChat = payload;
  },
  UPDATE_MESSAGES(state, payload) {
    state.chatMessages = payload;
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
    } else if (Array.isArray(payload) && state.chats.length == 0) {
      state.chats = payload;
    } else if (typeof payload == "object") {
      state.chats.push(payload);
    }
    if (payload?.initChat) {
      if (typeof payload == "object") {
        Vue.set(state, "activeChat", payload);
      } else {
        Vue.set(state, "activeChat", payload[0]);
      }
    }
  },
  UPDATE_ACTIVE_CHAT(state, payload) {
    if (!payload) {
      Vue.set(state, "activeChat", state.chats[0]);
    } else {
      Vue.set(state, "activeChat", payload);
    }
  }
};
