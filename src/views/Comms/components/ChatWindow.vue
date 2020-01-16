<template>
  <div class="chat_window_container">{{messages}}</div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
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
    }, 100000);
  },
  destroyed() {
    clearInterval(this.getMessagesInterval);
  },

  computed: {
    ...mapState("Comms", ["activeTranscript"])
  },
  methods: {
    ...mapActions("Comms", ["getMessages"])
  }
};
</script>

<style lang="scss" scoped>
.chat_window_container {
  height: 100%;
  width: 100%;
}
</style>