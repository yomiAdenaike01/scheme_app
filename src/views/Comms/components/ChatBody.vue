<template>
  <div class="chatbody_container flex columns">
    <div v-if="isActiveChat" class="window_wrapper height-100">
      <ChatWindow :messages="activeTranscript" />
      <ChatInput />
    </div>
    <div v-else class="flex_center no_active_chat">
      <Nocontent v-bind="noContent" />
    </div>
  </div>
</template>

<script>
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Nocontent from "@/components/Nocontent";
import { mapState } from "vuex";
export default {
  name: "ChatBody",
  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    noContent() {
      return {
        moreInformation: {
          index: "comms",
          instruction: "messenger"
        },
        text: "No active chats, select on to begin",
        icon: "el-icon-chat-round"
      };
    },
    isActiveChat() {
      return this.hasEntries(this.activeTranscript);
    }
  },
  components: {
    ChatWindow,
    ChatInput,
    Nocontent
  }
};
</script>
<style lang="scss" scoped>
.window_wrapper {
  position: relative;
  flex: 0.9;
}
.chatbody_container {
  flex: 1;
}
.no_active_chat {
  height: 100%;
  width: 100%;
}
</style>