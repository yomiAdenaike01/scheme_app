<template>
  <div class="comms_list_container">
    <div class="comms_list_toolbar flex_center p-3">
      <el-input
        placeholder="Seach chats"
        class="mr-3"
        size="small"
        v-model="transcriptSearch"
      ></el-input>
      <Popover width="200" trigger="click">
        <el-button
          icon="el-icon-plus"
          round
          size="small"
          circle
          slot="trigger"
        ></el-button>
        <div
          slot="content"
          v-loading="loading"
          class="start_chat_container p-2"
        >
          <el-select
            v-model="chat.recieverID"
            size="small"
            placeholder="Select team member"
          >
            <el-option
              v-for="(member, index) in team"
              :key="index"
              :value="member._id"
              :label="member.name"
            >
              {{ member.name }}
            </el-option>
          </el-select>
          <el-input
            type="textarea"
            class="mt-3 mb-3"
            size="small"
            v-model="chat.content"
            placeholder="Chat message"
          ></el-input>
          <el-button
            :disabled="!chat.content || !chat.recieverID"
            size="small"
            type="primary"
            round
            @click="sendMessage"
            >Initiate chat</el-button
          >
        </div>
      </Popover>
    </div>
    <div class="comms_list">
      <div
        class="no_content_wrapper flex_center"
        v-if="transcripts.length == 0"
      >
        <Nocontent v-bind="noContent" />
      </div>
      <div v-else>
        <CommsTranscript
          v-for="transcript in transcripts"
          :key="transcript._id"
          :data="transcript"
        />
      </div>
    </div>
  </div>
</template>

<script>
import CommsTranscript from "./CommsTranscript";
import Nocontent from "@/components/Nocontent";
import Popover from "@/components/Popover";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "CommsList",
  data() {
    return {
      transcriptSearch: "",
      loading: false,
      chat: {
        content: "",
        recieverID: ""
      }
    };
  },

  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["transcripts"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    team() {
      return this.teamInformation.filter(member => {
        return member._id != this.userInformation._id;
      });
    },
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
    filterCommsTranscripts() {
      let filteredCommsTranscripts = [];
      filteredCommsTranscripts.filter(transcript => {});
      return filteredCommsTranscripts;
    }
  },
  methods: {
    ...mapActions("Comms", ["getCommsTranscripts", "startChat"]),
    ...mapActions("Admin", ["getTeam"]),
    sendMessage() {
      this.loading = true;
      let userName = this.getUserInformation(this.chat.recieverID).name;

      this.startChat({
        ...this.chat,
        userName
      })
        .then(() => {
          reset();
        })
        .catch(() => {
          reset();
        });
    },
    async reset() {
      this.loading = false;
      this.$set(this, "chat", {});
      await this.getCommsTranscripts();
    }
  },
  components: {
    Nocontent,
    Popover,
    CommsTranscript
  }
};
</script>

<style lang="scss" scoped>
.comms_list_container {
  width: 20%;
  height: 100%;
  border-right: $border;
}
.comms_list {
  height: inherit;
  overflow-x: hidden;
}
.no_content_wrapper {
  height: 100%;
}
</style>
