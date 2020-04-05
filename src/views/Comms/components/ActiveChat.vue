<template>
  <div class="current_chat_container">
    <div class="active_chat_container">
      <div class="current_chat_header">
        <el-autocomplete
          v-model="teamQuery"
          :trigger-on-focus="false"
          :fetch-suggestions="queryTeam"
          placeholder="To: Enter name of person you want to message"
          @select="setReciever"
        ></el-autocomplete>
      </div>

      <div class="chatmessages_container">
        <p>Message</p>
        <div v-if="messages.length > 0">
          <div v-for="message in messages" :key="message._id">
            <p>{{ message.content }}</p>
          </div>
        </div>
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
    ChatActions: () => import("./ChatActions")
  },
  data() {
    return {
      intervalID: null,
      loading: false,
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
    ...mapState("Comms", ["activeChat", "messages"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters("Admin", ["getUserInformation"]),
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
  activated() {
    if (!this.activeChat?.initChat && this.hasEntries(this.activeChat)) {
      this.intervalID = "getChatMessages";
      this.loading = true;
      this.CREATE_GLOBAL_INTERVAL({
        immediate: true,
        id: this.intervalID,
        method: () => {
          return new Promise((resolve, reject) => {
            this.getChatMessages()
              .then(() => {
                resolve();
                this.loading = false;
              })
              .catch(() => {
                reject();
                this.loading = false;
              });
          });
        }
      });
    }
  },
  deactivated() {
    if (this.intervalID) {
      this.CLEAR_GLOBAL_INTERVAL(this.intervalID);
    }
  },
  methods: {
    ...mapMutations([
      "UPDATE_NOTIFICATIONS",
      "CREATE_GLOBAL_INTERVAL",
      "CLEAR_GLOBAL_INTERVAL"
    ]),
    ...mapActions("Comms", ["getChatMessages", "sendMessage"]),
    ...mapMutations("Comms", ["UPDATE_MESSAGES"]),
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
      if (!this.chat.recieverID || !userName) {
        return createError("No reciever found.");
      }

      if (!this.activeChat._id) {
        return createError("No active chat found.");
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
}
.active_chat_container {
  display: flex;
  flex: 1;
  position: relative;
  flex-direction: column;
  height: 100%;
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
