<template>
  <div class="chat_input_container columns">
    <el-input
      @keypress.enter="sendMessage"
      placeholder="Type message here...."
      v-model="chatContent.content"
      resize="both"
    >
      <template slot="prepend">
        <UploadFile
          :buttonConfig="{
            type: 'text',
            round: true,
            icon: 'el-icon-paperclip',
            circle: true
          }"
        />
      </template>
      <template slot="append">
        <div class="flex">
          <el-button
            type="text"
            circle
            icon="el-icon-position"
            @click="sendChatMessage"
          />
        </div>
      </template>
    </el-input>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
export default {
  name: "ChatInput",
  data() {
    return {
      chatContent: {
        attatchments: "",
        content: "",
        transcript_id: ""
      }
    };
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"])
  },
  methods: {
    ...mapActions("Comms", ["sendMessage"]),
    ...mapMutations("Comms", ["POLL_CHAT", "UPDATE_MESSAGES"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    sendChatMessage() {
      let { attatchments, content, transcript_id } = this.chatContent;
      if (!attatchments && !content) {
        this.UPDATE_NOTIFICATIONS({
          type: "warning",
          message: "Messages must have content"
        });
      } else {
        this.chatContent.transcript_id = this.activeTranscript._id;
        this.chatContent.reciever_id = this.activeTranscript.user_2;

        this.sendMessage(this.chatContent)
          .then(response => {
            return response;
          })
          .catch(error => {
            return error;
          });
      }
    }
  },
  components: {
    UploadFile
  }
};
</script>

<style lang="scss" scoped>
.chat_input_container {
  position: absolute;
  border-radius: 10px;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
