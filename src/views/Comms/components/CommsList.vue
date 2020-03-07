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
      <Popover width="200" trigger="click">
        <el-button
          icon="el-icon-plus"
          round
          size="small"
          circle
          slot="trigger"
          @click="startChat = !startChat"
        ></el-button>
        <div
          slot="content"
          v-loading="loading"
          class="start_chat_container p-2"
        >
          <el-select
            v-model="chat.userTwo"
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
            :disabled="!chat.content || !chat.userTwo"
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
      <div class="no_content_wrapper flex_center">
        <Nocontent v-bind="noContent" />
      </div>
    </div>
  </div>
</template>

<script>
import Nocontent from "@/components/Nocontent";
import Popover from "@/components/Popover";
import { mapState, mapActions } from "vuex";
export default {
  name: "CommsList",
  data() {
    return {
      transcriptSearch: "",
      startChat: false,
      loading: false,
      chat: {
        content: "",
        userTwo: ""
      }
    };
  },
  activated() {
    this.getTranscripts();
    this.getTeam();
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["transcripts"]),
    ...mapState("Admin", ["teamInformation"]),
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
    filterTranscripts() {
      let filteredTranscripts = [];
      filteredTranscripts.filter(transcript => {});
      return filteredTranscripts;
    }
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts"]),
    ...mapActions("Admin", ["getTeam"]),
    sendMessage() {
      this.loading = true;
      this.startChat({
        ...this.chat
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  },
  components: {
    Nocontent,
    Popover
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
