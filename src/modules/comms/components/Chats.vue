<template>
  <div class="chats_container">
    <div v-if="chats.length > 0" class="active_chats">
      <div class="chats_header">
        <el-input
          v-model="query"
          class="flat_input query_chats_container"
          placeholder="Search chats"
        />
      </div>
      <fade-transition group>
        <Chat
          v-for="(chat, index) in chats"
          :key="
            `${index}${Math.random()
              .toString(16)
              .slice(2)}`
          "
          :chat-index="index"
          :chat-information="chat"
        />
      </fade-transition>
      <div class="blank_message grey" @click="startNewChat">
        <i class="bx bx-plus"></i>
        <span>Compose</span>
      </div>
    </div>

    <TextDisplay
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
    </TextDisplay>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from "vuex";
import { FadeTransition } from "vue2-transitions";
export default {
  name: "Chats",
  components: {
    TextDisplay: () => import("@/components/TextDisplay"),
    Chat: () => import("./Chat"),
    FadeTransition
  },
  data() {
    return {
      query: ""
    };
  },
  computed: {
    ...mapState("Comms", ["chats"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getUserInformation"]),
    hasChats() {
      return this.chats.length > 0;
    }
  },

  methods: {
    ...mapActions("Comms", ["createStubChat"]),
    ...mapMutations("Comms", ["UPDATE_CHATS", "UPDATE_ACTIVE_CHAT"]),
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
  margin: 10px;
}
.query_chats_container /deep/ .el-input__inner {
  border: none;
}
</style>
