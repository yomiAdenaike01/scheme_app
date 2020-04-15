<template>
  <div
    ref="chatElem"
    class="transcript_container"
    :class="{ active: isActive }"
    @click="updateActiveChat"
  >
    <Avatar :name="chatInformation.userTwo.name" />
    <div class="text_container">
      <p v-if="!isNewChat">
        {{ chatInformation.message.content }}
      </p>
      <p v-else>New Message</p>
      <small class="grey">{{
        initMoment(chatInformation.dateUpdated).calendar()
      }}</small>
    </div>
    <div class="chat_extension_container">
      <div v-if="isActive" class="delete_chat_container">
        <el-button
          type="text"
          icon="el-icon-delete"
          circle
          @click="deleteChat"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "Chat",
  components: {
    Avatar: () => import("@/components/Avatar")
  },
  props: {
    chatIndex: {
      type: Number,
      default: 0
    },
    chatInformation: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState("Comms", ["activeChat"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    isNewChat() {
      return this.chatInformation?.initChat;
    },
    isActive() {
      return this.activeChat._id == this.chatInformation._id;
    }
  },
  activated() {
    this.updateScrollPos();
  },
  mounted() {
    this.updateScrollPos();
  },

  methods: {
    ...mapActions(["request"]),
    ...mapActions("Comms", ["getChats"]),
    ...mapMutations(["REMOVE_GLOBAL_INTERVAL"]),
    ...mapMutations("Comms", ["UPDATE_ACTIVE_CHAT", "DELETE_CHAT"]),
    updateScrollPos() {
      if (this.isNewChat) {
        this.$emit("scroll");
      }
    },
    updateActiveChat() {
      this.updateScrollPos();
      this.UPDATE_ACTIVE_CHAT({
        index: this.chatIndex,
        ...this.chatInformation
      });
    },
    deleteChat() {
      this.DELETE_CHAT(this.chatIndex);
      this.REMOVE_GLOBAL_INTERVAL("getChatMessages");
      this.request({
        method: "DELETE",
        url: "messenger/chat",
        data: { _id: this.chatInformation._id }
      })
        .then(() => {
          this.loading = false;
          this.getChats();
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.transcript_container {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid rgb(240, 240, 240);
  cursor: pointer;
  &.active {
    background: rgb(250, 250, 250);
  }
  &:hover .chat_extension_container {
    opacity: 1;
  }
}
.text_container {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  p {
    padding: 0;
    margin: 0;
  }
}
.chat_extension_container {
  transition: $default_transition opacity;
  opacity: 0;
  margin-left: auto;
}
</style>
