<template>
  <el-container style="height:100%">
    <el-container v-show="messages.length > 0" direction="vertical">
      <div style="overflow:auto; height:85%">
        <Message v-for="msg in messages" :key="msg._id" :message="msg" />
      </div>
      <MessageSender />
    </el-container>
    <el-main v-show="messages.length <= 0" class="no_messages_container">
      <h1>Select a conversation to view the messages.</h1>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MessengerBody",

  updated() {
    this.scrollToBottom();
  },
  computed: {
    ...mapState("Comms", ["messages"])
  },
  components: {
    Message: () => import("./Message"),
    MessageSender: () => import("./MessageSender")
  },
  methods: {
    scrollToBottom() {
      var messageDisplay = document.getElementsByTagName("main")[0];
      if (this.messages.length > 0) {
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.no_messages_container {
  background: #f9f9f9;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>