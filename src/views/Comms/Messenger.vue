<template>
  <el-row style="height:100%" type="flex">
    <el-col class="chatinfo_container">
      <StartNewChat />
      <PreviousChat />
    </el-col>
    <MessengerBody />
  </el-row>
</template>

<script>
import StartNewChat from './components/StartNewChat'
import MessengerBody from './components/MessengerBody'
import { mapActions, mapState, mapMutations } from 'vuex'
export default {
  name: 'Messenger',

  components: {
    PreviousChat: () => import('./components/PreviousChat'),
    StartNewChat,
    MessengerBody
  }
}
</script>

<style lang="scss" scoped>
.chatinfo_container {
  height: 100%;
  background: #fdfdfd;
  border-right: 1px solid #e6e6e6;
  flex: 0.5;
}

.chat_sender_container {
  display: flex;
  padding: 1.5em;
}
</style>
