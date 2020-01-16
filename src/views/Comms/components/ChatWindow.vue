<template>
  <div class="chat_window_container">
    <ChatMessage v-for="message in messages" :key="message._id" :message="message" />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ChatMessage from "./ChatMessage";
export default {
  name: "ChatWindow",
  data() {
    return {
      getMessagesInterval: null,
      messages: []
    };
  },
  created() {
    this.getMessagesInterval = setInterval(() => {
      this.getMessages({ transcript_id: this.activeTranscript._id })
        .then(response => {
          this.messages = response;
        })
        .catch(error => {
          console.log(error);
        });
    }, 10000);
  },
  destroyed() {
    clearInterval(this.getMessagesInterval);
  },

  computed: {
    ...mapState("Comms", ["activeTranscript"])
  },
  methods: {
    ...mapActions("Comms", ["getMessages"])
  },
  components: {
    ChatMessage
  }
};
</script>

<style lang="scss" scoped>
.chat_window_container {
  height: 100%;
  width: 100%;
}
</style>