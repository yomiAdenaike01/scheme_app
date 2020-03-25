<template>
  <div v-loading="" class="comms_list_container">
    <div class="comms_list_toolbar flex_center p-3">
      <el-input
        v-model="transcriptSearch"
        placeholder="Seach chats"
        class="mr-3"
        size="small"
      ></el-input>
      <Popover width="200" trigger="click">
        <Form
          slot="content"
          v-loading="loading"
          :config="createChatForm"
          submit-text="Initate Chat"
          @val="initChat"
        />
        <el-button
          slot="trigger"
          icon="el-icon-plus"
          round
          size="small"
          circle
        ></el-button>
      </Popover>
    </div>
    <div class="comms_list">
      <div
        v-if="transcripts.length == 0"
        class="no_content_wrapper flex_center"
      ></div>
      <!-- Transcripts -->
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
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

import CommsTranscript from "./CommsTranscript";
import CommsEventBus from "./CommsEventBus";

import Popover from "@/components/Popover";
import Form from "@/components/Form";

export default {
  name: "CommsList",
  components: {
    Popover,
    CommsTranscript,
    CommsEventBus,
    Form
  },
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
  activated() {
    CommsEventBus.$on("createNewChat", recieverID => {
      this.chat.recieverID = recieverID;
      this.UPDATE_NOTIFICATIONS({
        message:
          "You have selected a user to start a chat with, press the + button to start a new chat",
        title: "Start a new chat",
        type: "info"
      });
    });
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["transcripts"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters("Admin", ["getUserInformation", "getDropdownTeamMembers"]),

    createChatForm() {
      return [
        {
          "component-type": "text",
          model: "content",
          placeholder: "Chat content"
        },
        {
          "component-type": "select",
          placeholder: "Reciever",
          model: "recieverID",
          options: this.getDropdownTeamMembers
        }
      ];
    },
    team() {
      return this.teamInformation.filter(member => {
        return member._id != this.userInformation._id;
      });
    }
  },
  methods: {
    ...mapActions("Comms", ["getTranscripts", "startChat"]),
    ...mapActions("Admin", ["getTeam"]),
    ...mapMutations(["UPDATE_NOTIFICATIONS"]),

    initChat(chatInformation) {
      this.loading = true;
      let userName = this.getUserInformation(chatInformation.recieverID)?.name;

      const reset = () => {
        this.loading = false;
        this.getTranscripts();
      };

      this.startChat({
        ...chatInformation,
        userName
      })
        .then(() => {
          // Set active transcript to the chat
          this.UPDATE_ACTIVE_TRANSCRIPT(
            this.transcripts[this.transcripts.length - 1]
          );
          reset();
        })
        .catch(() => {
          reset();
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.comms_list_container {
  border-right: $border;
  flex: 0.5;
  height: 100%;
}
.comms_list_toolbar {
  flex: 1;
}
.comms_list {
  height: inherit;
  overflow-x: hidden;
}
.no_content_wrapper {
  height: 100%;
}
</style>
