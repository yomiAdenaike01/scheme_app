<template>
  <div class="chat_input_container columns">
    <el-input
      @keyup.enter="sendMessage"
      placeholder="Type message here...."
      v-model="chatContent.content"
      resize="both"
    >
      <template slot="prepend">
        <UploadFile
          :buttonConfig="{type:'text',round:true,icon:'el-icon-paperclip',circle:'true'}"
        />
      </template>
      <template slot="append">
        <div class="flex">
          <el-button type="text" circle icon="el-icon-position" @click="sendMessage" />
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
  comnputed: {
    ...mapState([])
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Comms", ["POLL_CHAT", "UPDATE_MESSAGES"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),
    sendMessage() {
      let { attatchments, content, transcript_id } = this.chatContent;
      if (!attatchments || !content) {
        this.UPDATE_NOTIFICATIONS({
          type: "warning",
          message: "Messages must have content"
        });
      } else {
        this.request(this.chatContent).then(response => {
          this.UPDATE_MESSAGES(response);
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