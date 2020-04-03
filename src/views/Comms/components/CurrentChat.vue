<template>
  <div class="current_chat_container">
    <div v-if="hasEntries(activeTranscript)" class="active_chat_container">
      <div class="current_chat_header">
        <!-- Summary information about that user and their current position -->
        <p>Header</p>
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
            @keyup.enter="sendMessage"
          />
          <!-- Send message input -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "CurrentChat",
  components: {
    Message: () => import("./Message"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  data() {
    return {
      chat: {
        message: ""
      }
    };
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    ...mapGetters()
  },
  methods: {
    sendMessage() {}
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
