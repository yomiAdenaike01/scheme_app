<template>
  <el-container class="p-3">
    <el-input placeholder="Search Messages" v-model="search" />
    <el-button
      class="ml-2"
      type="primary"
      round
      icon="el-icon-plus"
      @click="UPDATE_START_NEW_CHAT(true)"
      >New Chat</el-button
    >
    <StartNewChatDialog @newUser="createNewChatTranscript" />
  </el-container>
</template>

<script>
import StartNewChatDialog from './StartNewChatDialog'
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      search: '',
      newTranscript: {
        message: {
          content: ''
        },
        user_1: '',
        user_2: '',
        created_at: Date.now(),
        updated_at: Date.now()
      }
    }
  },
  created() {
    this.newTranscript.user_1 = this.currentUser._id
  },
  computed: {
    ...mapState(['currentUser']),
    ...mapState('Comms', ['startNewChat'])
  },
  methods: {
    ...mapMutations('Comms', [
      'UPDATE_START_NEW_CHAT',
      'UPDATE_ACTIVE_TRANSCRIPT'
    ]),
    createNewChatTranscript(e) {
      const newTranscript = this.newTranscript
      newTranscript.user_2 = e
      this.UPDATE_ACTIVE_TRANSCRIPT(newTranscript)
    }
  },
  components: {
    StartNewChatDialog
  },
  watch: {
    search(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style></style>
