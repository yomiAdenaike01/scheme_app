<template>
  <div class="current_chat_container">
    <div v-if="hasEntries(activeTranscript)">
      <div class="current_chat_header">
        <!-- Summary information about that user and their current position -->
      </div>
      <div class="user_information_sidebar">
        <!-- Other users infomration -->
        <!-- With in chat search and other functionality (create task, create event, create request) -->
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
    <InformationDisplay
      v-else
      :display-text="{ heading: '', content: '', hasIcon: true }"
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "CurrentChat",
  components: {
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
}
</style>
