<template>
  <el-row
    type="flex"
    :gutter="5"
    align="middle"
    style="background:rgb(249,249,249);"
    class="pt-3 pb-3"
  >
    <el-col>
      <el-input v-model="message.content" placeholder="Message Content...." type="textarea" />
    </el-col>
    <el-col>
      <el-row type="flex">
        <el-col>
          <el-button type="primary" @click="sendMessage" v-loading="loading" round>Send</el-button>
        </el-col>
        <el-col>
          <el-upload
            :file-list="message.attachments"
            action="#"
            :auto-upload="false"
            multiple
            :limit="2"
          >
            <i
              slot="default"
              class="el-icon-paperclip p-3"
              style="  background: whitesmoke;color: #666; border-radius: 50%;"
            ></i>
          </el-upload>
        </el-col>
      </el-row>
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
        attachments: [],
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
<style lang="scss" scoped>
.tool_icon {
}
</style>
