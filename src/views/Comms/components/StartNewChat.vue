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
    <StartNewChatDialog :display="display" @newUser="emitStartNewChat" @toggle="display=$event" />
  </el-container>
</template>

<script>
import StartNewChatDialog from "./StartNewChatDialog";
import { mapState } from "vuex";
export default {
  data() {
    return {
      display: false,
      search: "",
      newTranscript: {
        user_1: "",
        user_2: "",
        created_at: Date.now(),
        updated_at: Date.now()
      }
    };
  },
  created() {
    this.newTranscript.user_1 = this.currentUser._id;
  },
  computed: {
    ...mapState(["currentUser"])
  },
  methods: {
    emitStartNewChat(e) {
      const newTranscript = this.newTranscript;
      newTranscript.user_2 = e;
      this.$emit("startNewChat", newTranscript);
    }
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