<template>
  <div class="chatbody_container flex columns">
    <div v-if="!isActiveChat" class="window_wrapper height-100">
      <ChatWindow />
      <ChatInput />
    </div>
    <div v-else class="flex_center no_active_chat">
      <p>No active chats</p>
    </div>
  </div>
</template>

<script>
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { mapState } from "vuex";
export default {
  name: "ChatBody",
  computed: {
    ...mapState("Comms", ["activeChat"]),
    isActiveChat() {
      return Object.keys(this.activeChat).length > 0;
    }
  },
  components: {
    ChatWindow,
    ChatInput
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