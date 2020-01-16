<template>
  <el-col class="chat_list_container pr-0" :style="{ borderRight: `1.5px solid #efefef` }">
    <ChatListHeader />
    <div v-if="transcripts.length > 0">
      <PreviousChat :key="transcript._id" :data="transcript" v-for="transcript in transcripts" />
    </div>
    <!-- Error display -->
    <NoChats v-else />
  </el-col>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import PreviousChat from "./PreviousChat";
import ChatListHeader from "./ChatListHeader";
import NoChats from "./NoChats";
export default {
  name: "ChatList",
  computed: {
    ...mapState("Comms", ["transcripts"]),
    ...mapState(["localSettings"]),
    returnSidebar() {
      return this.localSettings.colours.sidebar;
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
