<template>
  <div class="input_container">
    <div class="chat_input_container flex flex--space-between">
      <el-input placeholder="Type message here...." type="textarea" v-model="chatContent.content" />
      <el-button circle icon="el-icon-position"></el-button>
      <UploadFile :buttonConfig="{round:true,icon:'el-icon-paperclip',circle:'true'}" />
    </div>
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
    ...mapMutations("Comms", ["POLL_CHAT"])
  },
  components: {
    UploadFile
  }
};
</script>

<style lang="scss" scoped>
.chat_input_container {
  width: 50%;
  position: absolute;
  left: 0%;
  right: 0;
  bottom: 0;
}
</style>