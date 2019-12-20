<template>
  <el-row type="flex" :gutter="5" class="p-3" align="middle">
    <el-col>
      <el-input v-model="message.content" placeholder="Message Content...." type="textarea" />
    </el-col>
    <el-col>
      <el-button
        type="primary"
        icon="el-icon-s-promotion"
        @click="sendMessage"
        v-loading="loading"
      />
    </el-col>
  </el-row>
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
    ...mapState("Comms", ["activeTranscript"]),
    dropdownConfig() {
      return [
        {
          name: "Add Attachments",
          command: "add_attachments"
        }
      ];
    }
  },
  methods: {
    handleTools(e) {
      console.log(e);
    },
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

