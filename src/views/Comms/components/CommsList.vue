<template>
  <div class="comms_list_container">
    <!-- Transcripts -->
    <div class="comms_list_toolbar flex_center p-3">
      <el-input placeholder="Seach chats" class="mr-3" size="small" v-model="transcriptSearch"></el-input>
      <Popover width="200" trigger="click">
        <Form
          slot="content"
          v-loading="loading"
          :config="createChatForm"
          @val="initChat"
          submitText="Initate Chat"
        />
        <el-button icon="el-icon-plus" round size="small" circle slot="trigger"></el-button>
      </Popover>
    </div>
    <div class="comms_list">
      <div class="no_content_wrapper flex_center" v-if="transcripts.length == 0">
        <InformationDisplay v-bind="infoDisplay" />
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
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";

import CommsTranscript from "./CommsTranscript";
import CommsEventBus from "./CommsEventBus";

import InformationDisplay from "@/components/InformationDisplay";
import Popover from "@/components/Popover";
import Form from "@/components/Form";

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
  components: {
    InformationDisplay,
    Popover,
    CommsTranscript,
    CommsEventBus,
    Form
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
    },
    infoDisplay() {
      return {
        moreInformation: {
          index: "admin",
          instruction: "requests"
        },
        text: "No chats found, you can create a new chat above.",
        icon: "bx bx-message-rounded"
      };
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
  flex: 0.5;
  height: 100%;
  border-right: $border;
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
