<template>
  <div class="current_chat_container">
    <div v-if="hasEntries(activeTranscript)" class="active_chat_container">
      <div class="current_chat_header">
        <!-- Summary information about that user and their current position -->
        <el-input v-if="isNewChat"></el-input>
      </div>

      <div class="messages_container">
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
            @keydown.enter="sendMessage"
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
    Message: () => import("./Message"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  data() {
    return {
      intervalID: null,
      loading: false,
      chat: {
        message: ""
      }
    };
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    isNewChat() {
      return this.activeTranscript?.initChat;
    }
  },
  activated() {
    if (!this.activeTranscript?.initChat) {
      this.intervalID = "getMessages";
      this.loading = true;
      this.CREATE_GLOBAL_INTERVAL({
        immediate: true,
        id: this.intervalID,
        method: () => {
          return new Promise((resolve, reject) => {
            this.getMessages()
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
    ...mapActions("Comms", ["getMessages"]),
    sendMessage() {
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
  padding: 20px;
  border-bottom: 2px solid whitesmoke;
}
.messages_container {
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
