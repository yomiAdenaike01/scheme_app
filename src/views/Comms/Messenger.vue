<template>
  <div class="container">
    <el-row type="flex" :gutter="10" class="messenger_container" v-loading="loading">
      <ChatList />
      <ChatBody />
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import ChatList from "./components/ChatList";
import ChatBody from "./components/ChatBody";
export default {
  name: "Messenger",
  data() {
    return {
      error: false,
      loading: true
    };
  },
  created() {
    this.getTranscripts()
      .then(response => {
        if (response.length > 0) {
          this.error = true;
          this.loading = false;
        } else {
          this.loading = false;
        }
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
    ChatBody
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
