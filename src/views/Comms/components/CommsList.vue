<template>
  <div class="comms_list_container">
    <div class="comms_list_toolbar flex_center">
      <el-input
        placeholder="Seach chats"
        class="mr-3"
        size="small"
        v-model="transcriptSearch"
      ></el-input>
      <!-- <Transcript v-for="transcript in transcripts" :data="transcript" /> -->
      <el-button
        icon="el-icon-plus"
        round
        size="small"
        circle
        @click="startChat = !startChat"
      ></el-button>
    </div>
    <el-collapse-transition>
      <div class="start_chat_container m-3" v-if="startChat">
        <el-select size="small" placeholder="Select team member">
          <el-option
            v-for="(member, index) in teamInformation"
            :key="index"
            :value="member._id"
            :label="member.name"
          >
          </el-option>
        </el-select>
        <el-input
          class="mt-3 mb-3"
          size="small"
          v-model="chat.content"
          placeholder="Chat message"
        ></el-input>
        <el-button size="small" type="primary" round @click="sendMessage"
          >Initiate chat</el-button
        >
      </div>
    </el-collapse-transition>
    <div class="comms_list">
      <div class="no_content_wrapper flex_center">
        <Nocontent v-bind="noContent" />
      </div>
    </div>
  </div>
</template>

<script>
import Nocontent from "@/components/Nocontent";
import { mapState, mapActions } from "vuex";
export default {
  name: "CommsList",
  data() {
    return {
      transcriptSearch: "",
      startChat: false,
      chat: {
        content: ""
      }
    };
  },
  activated() {
    this.getTranscripts();
  },
  computed: {
    ...mapState("Comms", ["transcripts"]),
    ...mapState(["teamInformation"]),
    noContent() {
      return {
        moreInformation: {
          index: "admin",
          instruction: "requests"
        },
        text: "No chats founds, you can create a new chat above.",
        icon: "bx bx-message-rounded"
      };
    },
    filterTranscripts() {
      let filteredTranscripts = [];
      filteredTranscripts.filter(transcript => {});
      return filteredTranscripts;
    }
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    sendMessage() {
      console.log("sending message");
    }
  },
  components: {
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.comms_list_container {
  border-right: $border;
  width: 20%;
  padding: 20px;
  height: 100%;
}
.comms_list {
  height: inherit;
}
.no_content_wrapper {
  height: 100%;
}
</style>
