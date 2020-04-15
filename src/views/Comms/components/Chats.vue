<template>
  <div class="chats_container">
    <div v-if="chats.length > 0" class="active_chats">
      <div class="chats_header">
        <el-input
          v-model="query"
          class="query_chats_container"
          placeholder="Search chats"
        />
      </div>
      <Chat
        v-for="(chat, index) in chats"
        :key="chat._id"
        :chat-index="index"
        :chat-information="chat"
      />
      <div class="blank_message grey" @click="startNewChat">
        <i class="bx bx-plus"></i>
        <span>Compose</span>
      </div>
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
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "Chats",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    Chat: () => import("./Chat")
  },
  data() {
    return {
      query: ""
    };
  },
  computed: {
    ...mapState("Comms", ["chats"]),
    ...mapState(["userInformation"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    hasChats() {
      return this.chats.length > 0;
    },

    queryChats() {
      let queriedChats = [];
      let query = this.query.toLowerCase();
      if (this.chats.length > 0) {
        this.chats.filter(chat => {
          return (
            this.getUserInformation(chat.userTwo)?.name?.toLowerCase() == query
          );
        });
      }
      return queriedChats.length > 0 ? queriedChats : this.chats;
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_CHATS", "UPDATE_ACTIVE_CHAT"]),
    startNewChat() {
      let isoDate = new Date().toISOString();
      // Check if there is a fake chat
      const createChat = () => {
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
      };
      if (this.chats.length == 0) {
        createChat();
      } else {
        var chatIndex = this.chats.findIndex(chat => {
          return chat?.initChat;
        });
        if (chatIndex == -1) {
          createChat();
        }
      }
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
  overflow-x: hidden;
  &.no_content {
    justify-content: center;
    align-items: center;
  }
}
.active_chats {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.blank_message {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: rgb(250, 250, 250);
  cursor: pointer;
  .bx {
    margin-right: 10px;
  }
}
.chats_header {
  border-bottom: 2px solid whitesmoke;
}
.query_chats_container /deep/ .el-input__inner {
  border: none;
}
</style>
