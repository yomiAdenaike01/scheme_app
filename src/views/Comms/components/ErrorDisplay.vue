<template>
  <div class="error_display flex_center columns">
    <i :style="{color:getClient.company_colours}" class="el-icon-chat-round no_chat_indiciator"></i>
    <p>No previous chats found</p>
    <el-button size="small" icon="el-icon-plus" round type="primary">Start New Chat</el-button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ErrorDisplay",
  computed: {
    ...mapGetters(["getClient"])
  }
};
</script>

<style lang="scss" scoped>
.error_display {
  line-height: 3em;
  height: 100%;
}
.no_chat_indiciator {
  margin-top: -1em;
  font-size: 2.5em;
  color: #ccc;
}
</style>