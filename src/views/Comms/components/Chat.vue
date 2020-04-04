<template>
  <div
    class="transcript_container"
    :class="{ active: isActive }"
    @click="UPDATE_ACTIVE_TRANSCRIPT(chatInformation._id)"
  >
    <Avatar :name="usersInformation.userTwo" />
    <div class="text_container">
      <p v-if="!chatInformation.hasOwnProperty('initChat')">
        {{ truncate(chatInformation.lastMessage.content) }}
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
  computed: {
    ...mapState("Comms", ["activeChat"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    isActive() {
      return this.activeChat._id == this.chatInformation._id;
    },
    usersInformation() {
      let { userOne, userTwo } = this.activeChat;
      return {
        userOne: this.getUserInformation(userOne)?.name,
        userTwo: this.getUserInformation(userTwo)?.name
      };
    }
  },
  props: {
    chatInformation: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"]),
    ...mapActions("Comms", ["getpreviousChats"]),
    deleteChat() {
      this.request({
        method: "DELETE",
        url: "messenger/previousChats",
        data: { _id: this.chatInformation._id }
      })
        .then(() => {
          this.loading = false;
          this.getpreviousChats();
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
    background: rgb(252, 252, 252);
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
