<template>
  <div class="container">
    <el-row type="flex" :gutter="10" class="messenger_container" v-loading="loading">
      <ChatList />
      <ChatBody />
      <NewChatDialog />
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ChatList from "./components/ChatList";
import ChatBody from "./components/ChatBody";
import NewChatDialog from "./components/NewChatDialog";
export default {
  name: "Messenger",
  data() {
    return {
      error: false,
      loading: true
    };
  },
  activated() {
    this.getTranscripts()
      .then(response => {
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.error = true;
      });
  },
  computed: {
    ...mapState("Comms", ["transcripts"])
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"])
  },
  components: {
    ChatList,
    ChatBody,
    NewChatDialog
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
}
.messenger_container {
  height: 100%;
}
</style>
