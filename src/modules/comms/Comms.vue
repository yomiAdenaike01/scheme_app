<template>
  <div v-if="team.length > 0" class="comms_container">
    <Chats />
    <ActiveChat
      v-if="Object.values(activeChat).length > 0"
      :user-to-message="userToMessage"
    />
    <div v-else class="no_active_chat">
      <i class="bx bxl-discourse large_icon"></i>
      <h1>Select a chat to begin...</h1>
    </div>
  </div>
  <div v-else class="no_content center">
    <h2>No team members</h2>
    <p>To create a team member please go to user management</p>
    >
    <i slot="header" class="bx bx-user"></i>
    <s-button class="primary rounded" @click="$router.push({ name: 'team' })"
      >Go to team management</s-button
    >
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import Chats from "./components/Chats";
import ActiveChat from "./components/ActiveChat";
import SButton from "@/components/SButton";
export default {
  name: "CommsModule",
  components: {
    Chats,
    ActiveChat,
    SButton
  },
  computed: {
    ...mapState(["globalIntervals"]),
    ...mapState("Team", ["team"]),
    ...mapState("Comms", ["activeChat"]),
    userToMessage() {
      return this.$route.params?.userToMessage;
    }
  },
  created() {
    this.CREATE_GLOBAL_INTERVAL({
      id: "commsCalls",
      immediate: true,
      method: () => {
        return new Promise((resolve, reject) => {
          this.getChats()
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject(err);
            });
        });
      },
      duration: this.globalIntervals.chat
    });
  },
  activated() {
    this.handleRouting();
  },
  methods: {
    ...mapActions("Comms", ["getChats"]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL"]),
    ...mapMutations("Comms", ["UPDATE_ACTIVE_CHAT"]),
    handleRouting() {
      let chat_id = this.$route.params?.chat_id;
      if (chat_id) {
        let chatIndex = this.chats.findIndex(chat => {
          return chat._id == chat_id;
        });
        this.UPDATE_ACTIVE_CHAT(this.chats[chatIndex]);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.comms_container {
  background: white;
  display: flex;
  flex: 1;
  height: 100%;
}
.no_active_chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  color: rgb(220, 220, 220);
}
</style>
