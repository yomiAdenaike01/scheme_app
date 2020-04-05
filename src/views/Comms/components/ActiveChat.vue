<template>
  <div v-loading="loading" class="current_chat_container">
    <div class="active_chat_container">
      <div class="current_chat_header">
        <el-autocomplete
          v-if="activeChat.initChat"
          v-model="teamQuery"
          :trigger-on-focus="false"
          :fetch-suggestions="queryTeam"
          placeholder="To: Enter name of person you want to message"
          @select="setReciever"
        ></el-autocomplete>
      </div>

      <div class="chatmessages_container">
        <ChatMessage
          v-for="message in chatMessages"
          :key="message._id"
          v-bind="message"
        />
      </div>

      <div class="current_chat_interaction">
        <ChatActions
          @emojiSelection="includeEmoji"
          @uploadAttachment="addAttachment"
        />
        <div class="send_message_container">
          <el-input
            v-model="chat.content"
            placeholder="Send a message..."
            @keypress.enter="sendChatMessage"
          />
          <el-button type="text" @click="sendChatMessage">Send</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "ActiveChat",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    ChatActions: () => import("./ChatActions"),
    ChatMessage: () => import("./ChatMessage")
  },
  data() {
    return {
      intervalID: null,
      loading: true,
      teamQuery: "",
      chat: {
        content: "",
        attachements: [],
        sentAt: new Date().toISOString(),
        isRead: false,
        editted: false,
        recieverID: ""
      }
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["activeChat", "messages"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    chatMessages() {
      return [...this.messages].map(message => {
        return Object.assign(
          {
            sentAt: this.formatDate(message.sentAt),
            isSentByUser: message.senderID == this.userInformation._id
          },
          message
        );
      });
    },
    isNewChat() {
      return this.activeChat?.initChat;
    },
    activeChatEntries() {
      return this.hasEntries(this.activeChat);
    },
    queryTeamList() {
      return this.teamInformation.map(member => {
        return {
          value: member.name,
          link: member._id
        };
      });
    }
  },
  watch: {
    activeChat() {
      this.clearMessageInterval().then(() => {
        this.initGetChats();
      });
    }
  },

  mounted() {
    this.initGetChats();
  },
  destroyed() {
    this.clearMessageInterval();
  },
  beforeDestory() {
    this.clearMessageInterval();
  },
  methods: {
    ...mapMutations([
      "UPDATE_NOTIFICATIONS",
      "CREATE_GLOBAL_INTERVAL",
      "CLEAR_GLOBAL_INTERVAL"
    ]),
    ...mapActions("Comms", ["getChatMessages", "sendMessage"]),
    ...mapMutations("Comms", ["UPDATE_MESSAGES"]),
    initGetChats() {
      this.loading = true;
      this.getChatMessages()
        .then(() => {
          this.loading = false;
          this.beginMessageInterval();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    beginMessageInterval() {
      if (!this.activeChat?.initChat && this.hasEntries(this.activeChat)) {
        this.intervalID = "getChatMessages";
        this.CREATE_GLOBAL_INTERVAL({
          id: this.intervalID,
          method: () => {
            return new Promise((resolve, reject) => {
              this.getChatMessages()
                .then(() => {
                  resolve();
                })
                .catch(() => {
                  reject();
                });
            });
          }
        });
      }
    },
    clearMessageInterval() {
      return new Promise((resolve, reject) => {
        try {
          if (this.intervalID) {
            this.CLEAR_GLOBAL_INTERVAL(this.intervalID);
            resolve();
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    includeEmoji(emoji) {
      console.log(emoji);
    },
    addAttachment(attachment) {
      console.log(attachment);
    },
    setReciever({ link }) {
      this.chat.recieverID = link;
    },

    queryTeam(name, cb) {
      let queriedTeam = [];
      if (this.queryTeamList.length > 0) {
        name = name?.toLowerCase() ?? this.teamQuery?.toLowerCase();
        queriedTeam = this.queryTeamList.filter(x => {
          return x?.value?.toLowerCase() == name;
        });
      }
      cb(queriedTeam.length > 0 ? queriedTeam : this.queryTeamList);
    },
    sendChatMessage() {
      let userName = this.getUserInformation(this.chat.recieverID)?.name;
      const createError = message => {
        this.UPDATE_NOTIFICATIONS({
          title: "Failed to send message",
          message,
          type: "error"
        });
      };
      if (!this.chat.content) {
        return createError("No message content found.");
      }
      if ((this.isNewChat && !this.chat.recieverID) || !userName) {
        return createError("No reciever found.");
      }

      if (!this.activeChat._id) {
        return createError("No active chat found.");
      }

      if (!this.isNewChat) {
        this.chat.recieverID = this.activeChat.userTwo;
        userName = this.getUserInformation(this.chat.recieverID)?.name;
      }

      this.sendMessage({
        ...this.chat,
        chatID: this.activeChat._id,
        isRead: false,
        editted: false,
        userName
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.current_chat_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.current_chat_header {
  border-bottom: 2px solid whitesmoke;
  &/deep/ .el-input {
    font-size: 14px;
    padding: 10px;
  }
  .el-autocomplete {
    position: relative;
    flex: 1;
    display: flex;
    font-size: 1.3em;
  }

  .el-autocomplete /deep/ .el-input__inner {
    border: none;
    flex: 1;
  }
}
.chatmessages_container {
  display: flex;
  flex: 1;
  max-height: calc(100% - 90px);
  overflow-x: hidden;
  width: 100%;
}
.active_chat_container {
  display: flex;
  flex: 1;
  position: relative;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.current_chat_interaction {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex: 1;
  padding: 10px 20px;
  .send_message_container {
    display: flex;
    flex: 1;
    &/deep/ {
      .el-input__inner {
        padding: 20px;
        border: none;
        background: rgb(250, 250, 250);
        border-radius: 30px;
      }
      .el-input {
        padding: 10px;
        font-size: 1em;
      }
    }
  }
}
</style>
