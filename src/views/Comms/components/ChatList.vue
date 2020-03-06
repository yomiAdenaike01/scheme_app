<template>
  <el-col
    v-loading="loading"
    class="chat_list_container pr-0"
    :style="{ borderRight: `1.5px solid #efefef` }"
  >
    <ChatListHeader @removeChat="removeChatState = true" />
    <div v-if="transcripts.length > 0">
      <PreviousChat
        v-click-outside="toggleRemoveChatState"
        :selectionState="removeChatState"
        @selectedChat="selectedChat = $event"
        :key="transcript._id"
        :data="transcript"
        v-for="transcript in transcripts"
      />
    </div>
    <NoChats v-else />
  </el-col>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import PreviousChat from "./PreviousChat";
import ChatListHeader from "./ChatListHeader";
import NoChats from "./NoChats";
export default {
  name: "ChatList",
  data() {
    return {
      selectedChat: "",
      loading: false,
      removeChatState: false
    };
  },
  computed: {
    ...mapState("Comms", ["transcripts"]),
    ...mapState(["localSettings"]),
    returnSidebar() {
      return this.localSettings.colours.sidebar;
    }
  },
  methods: {
    ...mapActions("Comms", ["removeChat"]),
    toggleRemoveChatState() {
      if (this.removeChatState) {
        this.removeChatState = false;
      }
    },
    removeChatMethod() {
      this.removeChat({ transcript_id: this.selectedChat })
        .then(response => {
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    }
  },

  components: {
    PreviousChat,
    ChatListHeader,
    NoChats
  }
};
</script>

<style lang="scss" scoped>
.chat_list_container {
  height: 100%;
  width: 40%;
}
</style>
