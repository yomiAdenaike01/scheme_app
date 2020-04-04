<template>
  <div class="current_chat_container">
    <div v-if="hasEntries(activeChat)" class="active_chat_container">
      <div class="current_chat_header">
        <!-- Summary information about that user and their current position -->
        <el-autocomplete
          v-if="isNewChat"
          v-model="recieverName"
          :fetch-suggestions="teamSearch"
          placeholder="To: Enter name of person you want to message"
          @select="setReciever"
        ></el-autocomplete>
      </div>

      <div class="chatmessages_container">
        <!-- Messages go here -->
        <p>Messages</p>
      </div>

      <div class="current_chat_interaction">
        <div class="quick_actions_container">
          <!-- Send attachments -->
          <!-- Send emoji -->
        </div>
        <div class="send_message_container">
          <el-input
            v-model="chat.message"
            placeholder="Send a message..."
            @keydown.enter="sendChatMessage"
          />
          <!-- Send message input -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "CurrentChat",
  components: {
    ChatMessage: () => import("./ChatMessage"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  data() {
    return {
      intervalID: null,
      loading: false,
      recieverName: "",
      chat: {
        message: "",
        recieverID: ""
      }
    };
  },
  computed: {
    ...mapState("Comms", ["activeChat"]),
    ...mapState("Admin", ["teamInformation"]),
    isNewChat() {
      return this.activeChat?.initChat;
    }
  },
  activated() {
    if (!this.activeChat?.initChat) {
      this.intervalID = "getChatchatMessages";
      this.loading = true;
      this.CREATE_GLOBAL_INTERVAL({
        immediate: true,
        id: this.intervalID,
        method: () => {
          return new Promise((resolve, reject) => {
            this.getChatchatMessages()
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
    ...mapActions("Comms", ["getChatchatMessages"]),
    setReciever(e) {
      this.chat.recieverID = e;
    },
    teamSearch(name) {
      let foundTeam = [];
      if (this.teamInformation.length > 0) {
        name = name.toLowerCase() ?? this.recieverName.toLowerCase();
        foundTeam = this.teamInformation.filter(x => {
          x.name.toLowerCase() == name;
        });
      }
      return foundTeam;
    },
    sendChatMessage() {
      if (!this.chat.message) {
        this.UPDATE_NOTIFICATIONS({
          title: "Failed to send message",
          message: "No content found in message"
        });
      }
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
  flex: 1;
  .send_message_container {
    display: flex;
    flex: 1;
    background: whitesmoke;
  }
}
.user_information_sidebar {
}
</style>
