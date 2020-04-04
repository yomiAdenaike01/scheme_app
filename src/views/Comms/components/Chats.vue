<template>
  <div class="chats_container" :class="{ no_content: chats.length == 0 }">
    <!-- Search for previousChats -->
    <div v-if="hasEntries(chats)">
      <el-input v-model="chatSearch" placeholder="Search chats" />
      <Chat v-for="chat in chats" :key="chat._id" :chat-information="chat" />
    </div>

    <InformationDisplay
      v-else
      class="no_content"
      :display-text="{
        heading: 'No previous chats',
        content: 'Press the button below to start a new chat',
        icon: 'bx bx-message-group',
        hasIcon: true
      }"
    >
      <el-button
        slot="body"
        circle
        type="text"
        icon="el-icon-plus"
        @click="startNewChat"
      ></el-button>
    </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Chats",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    Chat: () => import("./Chat")
  },
  data() {
    return {
      chatSearch: ""
    };
  },
  computed: {
    ...mapState("Comms", ["chats"]),
    ...mapState(["userInformation"])
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_CHATS"]),
    startNewChat() {
      let isoDate = new Date().toISOString();
      // Create a fake chat
      this.UPDATE_CHATS({
        userOne: this.userInformation._id,
        userTwo: Math.random()
          .toString(16)
          .slice(2),
        dateCreated: isoDate,
        dateUpdated: isoDate,
        initChat: true,
        _id: Math.random()
          .toString(16)
          .slice(2)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.chats_container {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 0.2;
  border-right: 2px solid whitesmoke;
  position: relative;
  &.no_content {
    justify-content: center;
    align-items: center;
  }
}
</style>
