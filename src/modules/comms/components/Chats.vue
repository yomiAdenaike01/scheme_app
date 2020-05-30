<template>
  <div class="chats_container">
    <div v-if="chats.length > 0" class="active_chats">
      <header class="filters_container">
        <i class="bx bx-search grey"></i>
        <input
          v-model="query"
          type="text"
          class="s_input"
          placeholder="Search chats"
        />
      </header>
      <Chat
        v-for="(chat, index) in filteredChats"
        :key="`${index}${genID()}`"
        :chat-index="index"
        :chat-information="chat"
      />
      <div class="grey compose_container">
        <i class="bx bx-plus"></i>
        <p>Start new chat</p>
      </div>
    </div>
    <div v-else class="text_container all_centre">
      <h2>No previous chats</h2>
      <p>Press the button below to start a new chat</p>
      <s-button class="only_icon secondary" icon="plus" @click="startNewChat" />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import Chat from "./Chat";

import genID from "@/mixins/genID";
import SButton from "@/components/SButton";

export default {
  name: "Chats",
  components: {
    Chat,
    SButton
  },
  mixins: [genID],
  data() {
    return {
      query: ""
    };
  },
  computed: {
    ...mapState("Comms", ["chats"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["userLookup"]),
    hasChats() {
      return this.chats.length > 0;
    },
    filteredChats() {
      let filteredChats = [];
      let chats = [...this.chats];
      let query = this.query.toLowerCase();

      for (let i = 0, len = chats.length; i < len; i++) {
        let chat = chats[i];
        let { user_two, user_one, date_created } = chat;
        if (
          !user_two.name.toLowerCase().includes(query) ||
          !user_one.name.toLowerCase().includes(query)
        ) {
          continue;
        }
        filteredChats.push(chat);
      }
      return filteredChats.length > 0 ? filteredChats : chats;
    }
  },
  deactivated() {
    let newChatIndex = this.chats.findIndex(chat => {
      return chat?.initChat;
    });
    this.DELETE_CHAT(newChatIndex);
  },
  methods: {
    ...mapActions("Comms", ["createStubChat"]),
    ...mapMutations("Comms", [
      "UPDATE_CHATS",
      "UPDATE_ACTIVE_CHAT",
      "DELETE_CHAT"
    ]),
    startNewChat() {
      if (this.chats.length == 0) {
        this.createStubChat();
      } else {
        var chatIndex = this.chats.findIndex(chat => {
          return chat?.initChat;
        });
        if (chatIndex == -1) {
          this.createStubChat();
        } else {
          this.UPDATE_ACTIVE_CHAT(this.chats[chatIndex]);
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
  flex: 0.4;
  border-right: $border;
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
  height: 100%;
}

.filters_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  > * {
    flex: 1;
  }
  .bx {
    flex: 0.05;
  }
}
.query_chats_container /deep/ .el-input__inner {
  border: none;
}

.compose_container {
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
  p {
    padding: 0;
    margin: 0;
  }
}
</style>
