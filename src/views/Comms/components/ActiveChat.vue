<template>
  <div class="current_chat_container">
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

      <div ref="chatMessages" class="chat_messages_container">
        <ChatMessage
          v-for="(message, index) in chatMessages"
          :key="`${message._id}${index}`"
          v-bind="message"
          @editMessage="editMessage"
          @deleteMessage="deleteMessage"
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
            @keyup.enter.native="sendChatMessage"
          />
          <el-button type="text" @click="sendChatMessage">Send</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import scrollToBottom from "@/mixins/scrollToBottom";
import ChatMessage from "./ChatMessage";
export default {
  name: "ActiveChat",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    ChatActions: () => import("./ChatActions"),
    ChatMessage
  },
  mixins: [scrollToBottom],
  props: {
    userToMessage: {
      type: Object,
      default: () => {
        return {
          name: "",
          _id: ""
        };
      }
    }
  },
  data() {
    return {
      intervalID: null,
      loading: true,
      teamQuery: this.userToMessage?.name,
      chat: {
        content: "",
        attachements: [],
        sentAt: new Date().toISOString(),
        isRead: false,
        editted: false,
        reciever: this.userToMessage?._id
      }
    };
  },
  watch: {
    activeChat(val) {
      if (val) {
        this.scrollToBottom(this.$refs.chatMessages);
      }
    }
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["activeChat", "messages"]),
    ...mapState("Admin", ["team"]),
    ...mapGetters("Admin", ["getUserInformation"]),

    chatMessages() {
      return [...this.activeChat?.messages].map(message => {
        return Object.assign(
          {
            id: message._id,
            sentAt: this.initMoment(message.sentAt).calendar(),
            sentBy: message.sender?.name,
            isSentByUser: message.sender._id == this.userInformation._id
          },
          message
        );
      });
    },
    isNewChat() {
      return this.activeChat.hasOwnProperty("initChat");
    },
    activeChatEntries() {
      return this.hasEntries(this.activeChat);
    },
    autoCompleteTeam() {
      let team = this.team.map(member => {
        return {
          value: member.name,
          link: member._id
        };
      });

      return team;
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

    editMessage(messageID) {
      console.log(messageID);
    },
    deleteMessage(messageID) {
      console.log(messageID);
    },

    includeEmoji(emoji) {
      console.log(emoji);
    },
    addAttachment(attachment) {
      console.log(attachment);
    },
    setReciever({ link }) {
      this.chat.reciever = link;
    },

    queryTeam(name, cb) {
      let queriedTeam = [];
      name = name.toLowerCase();
      queriedTeam = this.autoCompleteTeam.filter(x => {
        return x.value.toLowerCase() == name;
      });
      cb(queriedTeam.length > 0 ? queriedTeam : this.autoCompleteTeam);
    },
    sendChatMessage() {
      let userName = this.getUserInformation(this.chat.reciever)?.name;

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
      if (!this.chat.reciever && this.activeChat?.initChat) {
        return createError("No chat reciever found.");
      }

      if (!this.activeChat._id) {
        return createError("No active chat found.");
      }

      if (!this.isNewChat) {
        this.chat.reciever = this.activeChat.userTwo._id;
        userName = this.getUserInformation(this.chat.reciever)?.name;
      }
      let sendMessage = {
        ...this.chat,
        chatID: this.activeChat._id,
        isRead: false,
        editted: false,
        sender: {
          _id: this.userInformation._id,
          name: this.userInformation.name
        }
      };
      this.sendMessage(sendMessage);
      this.chat.content = "";
      this.scrollToBottom(this.$refs.chatMessages);
    }
  }
};
</script>

<style lang="scss" scoped>
.current_chat_container {
  display: flex;
  flex: 1;
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
.chat_messages_container {
  overflow-x: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-height: calc(100% - 130px);
}
.active_chat_container {
  max-height: fit-content;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}
.current_chat_interaction {
  border-top: 2px solid rgb(240, 240, 240);
  align-items: center;
  background: white;
  padding: 10px 20px;
  height: 100px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
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
</style>
