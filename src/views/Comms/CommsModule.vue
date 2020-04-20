<template>
  <div v-if="team.length > 0" class="comms_container">
    <Chats />
    <ActiveChat
      v-if="Object.values(activeChat).length > 0"
      :user-to-message="userToMessage"
    />
  </div>
  <div v-else class="no_content center">
    <InformationDisplay
      :display-text="{
        heading: 'No team members',
        hasIcon: true,
        content: 'To create a team member please go to user management'
      }"
    >
      <i slot="header" class="bx bx-user"></i>
      <el-button slot="body" type="text" @click="$router.push({ name: 'user' })"
        >Go to user management</el-button
      >
    </InformationDisplay>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
export default {
  name: "CommsModule",
  components: {
    Chats: () => import("./components/Chats"),
    ActiveChat: () => import("./components/ActiveChat"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  computed: {
    ...mapState(["requestIntervals"]),
    ...mapState("Admin", ["team"]),
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
      duration: this.requestIntervals.chat
    });
  },
  methods: {
    ...mapActions("Comms", ["getChats"]),
    ...mapMutations(["CREATE_GLOBAL_INTERVAL"])
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
</style>
