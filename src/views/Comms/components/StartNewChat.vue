<template>
  <el-container class="p-3">
    <el-input placeholder="Search Messages" v-model="search" />
    <el-button
      class="ml-2"
      type="primary"
      round
      icon="el-icon-chat-round"
      @click="display = true"
    >New Chat</el-button>
    <StartNewChatDialog :display="display" />
  </el-container>
</template>

<script>
import StartNewChatDialog from "./StartNewChatDialog";
export default {
  data() {
    return {
      display: false,
      search: ""
    };
  },
  components: {
    StartNewChatDialog
  },
  watch: {
    search(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style>
</style>