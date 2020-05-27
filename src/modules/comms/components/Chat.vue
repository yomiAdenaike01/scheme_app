<template>
  <div
    ref="chatElem"
    class="transcript_container"
    :class="{ active: isActive }"
    @click="updateActiveChat"
  >
    <Avatar :name="oppositeUser" />
    <div class="text_container">
      <p v-if="!isNewChat">
        {{ lastMessage.content }}
      </p>
      <p v-else>New Message</p>
      <small class="grey">{{
        initMoment(chatInformation.date_updated).calendar()
      }}</small>
    </div>
    <div class="chat_extension_container">
      <div v-if="isActive" class="delete_chat_container">
        <s-button
          type="text"
          icon="trash"
          class="only_icon tertiary"
          @click="deleteChat"
        ></s-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import Avatar from "@/components/Avatar";
import SButton from "@/components/SButton";
export default {
  name: "Chat",
  components: {
    Avatar,
    SButton
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
    ...mapState(["userInformation"]),
    ...mapState("Comms", ["activeChat", "chats"]),
    ...mapGetters(["userLookup"]),
    oppositeUser() {
      if (this.chatInformation.user_two._id == this.userInformation._id) {
        return this.chatInformation.user_one.name;
      } else {
        return this.chatInformation.user_two.name;
      }
    },
    lastMessage() {
      return this.chatInformation.messages[
        this.chatInformation.messages.length - 1
      ];
    },
    isNewChat() {
      return this.chatInformation?.initChat;
    },
    isActive() {
      return this.activeChat?._id == this.chatInformation._id;
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapActions("Comms", ["getChats"]),
    ...mapMutations(["REMOVE_GLOBAL_INTERVAL"]),
    ...mapMutations("Comms", [
      "UPDATE_ACTIVE_CHAT",
      "DELETE_CHAT",
      "CLEAR_ACTIVE_CHAT"
    ]),

    updateActiveChat() {
      this.UPDATE_ACTIVE_CHAT({
        index: this.chatIndex,
        ...this.chatInformation
      });
    },
    deleteChat(e) {
      e.stopPropagation();
      this.DELETE_CHAT(this.chatIndex);
      if (!this.chatInformation?.initChat) {
        let chat = this.chatInformation;
        let condition = {};
        if (chat.user_two == this.userInformation._id) {
          condition = {
            user_two: this.userInformation._id
          };
        } else {
          condition = {
            user_one: this.userInformation._id
          };
        }
        // get the sender or reciever of messages

        this.request({
          method: "DELETE",
          url: "messenger/chat",
          data: { _id: chat._id, condition }
        });
      }
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
