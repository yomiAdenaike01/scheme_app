<template>
  <el-row style="height:100%">
    <el-col :span="5" class="chatinfo_container">
      <StartNewChat />
      <PreviousChat />
    </el-col>
    <MessengerBody />
  </el-row>
</template>

<script>
import StartNewChat from "./components/StartNewChat";
import MessengerBody from "./components/MessengerBody";
import { mapActions, mapState, mapMutations } from "vuex";
export default {
  name: "Messenger",

  components: {
    PreviousChat: () => import("./components/PreviousChat"),
    StartNewChat,
    MessengerBody
  }
};
</script>

<style lang="scss" scoped>
.chatinfo_container {
  height: 100%;
  background: #fdfdfd;
  border-right: 1px solid #e6e6e6;
}

.chat_sender_container {
  display: flex;
  padding: 1.5em;
}
</style>