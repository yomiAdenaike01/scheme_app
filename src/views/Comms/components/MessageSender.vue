<template>
  <div class="chat_sender_container">
    <el-input v-model="message.content" placeholder="Message Content...." />
    <el-button icon="el-icon-s-promotion" @click="sendMessage" v-loading="loading" />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "MessageSender",
  data() {
    return {
      loading: false,
      message: {
        content: "",
        attachments: "",
        transcript_id: "",
        reciever_id: ""
      }
    };
  },
  computed: {
    ...mapState(["activeTranscript"])
  },
  methods: {
    sendMessage() {
      this.loading = true;

      this.message.transcript_id = this.activeTranscript.id;
      this.message.reciever_id = this.activeTranscript.reciever;

      const payload = {
        method: "POST",
        data: this.message,
        url: "/messenger/send"
      };

      this.request(payload)
        .then(response => {
          this.UPDATE_MESSAGES({ messages: response, event: "push" });
          this.message.content = "";
          this.loading = false;
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error.message
          });
        });
    }
  }
};
</script>

<style>
</style>