<template>
  <el-dialog
    :visible.sync="displayModal"
    class="newchat_dialog"
    style="height:100%"
  >
    <Title
      slot="title"
      title="Select a team member"
      subtitle="Hover over a team members avatar to display their full name."
    />
    <div
      style="  overflow: auto;
  height: 5%;"
    >
      <el-card
        v-for="member in team"
        :key="member._id"
        class="member_card m-4"
        @click.native=";(displayContent = true), (chatMember = member)"
        v-loading="loading"
      >
        <el-button
          size="small"
          disabled
          class="indicator"
          v-if="chatMember._id == member._id"
          type="primary"
          icon="el-icon-check"
          circle
        ></el-button>

        <Popover>
          <template #content>
            <p class="member_name grey ml-3 mr-3 mb-2">
              Send message to {{ member.name }}
            </p>
          </template>
          <template #trigger>
            <Avatar :name="member.name" />
          </template>
        </Popover>
      </el-card>
    </div>
    <el-collapse-transition>
      <div class="send_message m-4" v-if="displayContent">
        <el-input
          v-model="message.content"
          @keyup.enter.native="sendNewChatMessage"
          class="mr-4"
          :placeholder="`Type message to ${chatMember.name}`"
        />
        <el-button @click="sendNewChatMessage">Send Message</el-button>
      </div>
    </el-collapse-transition>
  </el-dialog>
</template>

<script>
import Title from '@/components/Title'
import Avatar from '@/components/Avatar'
import Popover from '@/components/Popover'

import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'StartNewChatDialog',
  data() {
    return {
      displayContent: false,
      loading: false,
      dialogLoading: null,
      chatMember: {},
      message: {
        content: '',
        reciever_id: '',
        attachments: ''
      }
    }
  },
  activated() {
    this.dialogLoading = this.$loading({
      target: '.el-dialog'
    })
  },
  computed: {
    ...mapState('Admin', ['team']),
    ...mapState('Comms', ['transcripts', 'startNewChat']),

    displayModal: {
      get() {
        return this.startNewChat
      },
      set(display) {
        this.UPDATE_START_NEW_CHAT(display)
      }
    }
  },
  methods: {
    ...mapMutations('Comms', ['UPDATE_START_NEW_CHAT']),
    ...mapActions(['request']),
    sendNewChatMessage() {
      let member = this.chatMember
      if (this.message.content.length <= 0) {
        this.$notify({
          title: 'Failed to send',
          type: 'error',
          message: 'Please enter text to send a messsage.',
          onclick: () => {
            this.message.content = 'Hello!'
            this.sendNewChatMessage()
          }
        })
      } else {
        this.message.reciever_id = member._id
        let payload = {
          url: '/messenger/start',
          method: 'POST',
          data: this.message
        }
        this.request(payload)
          .then(response => {
            this.UPDATE_START_NEW_CHAT(false)
            this.loading = false
          })
          .catch(error => {
            this.UPDATE_START_NEW_CHAT(false)
            this.loading = false
          })
      }
    }
  },
  components: {
    Title,
    Avatar,
    Popover
  },
  props: {
    display: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    team(val) {
      if (val.length > 0) {
        this.dialogLoading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.newchat_dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}
.member_card {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
}
.select_user_2 {
  text-transform: capitalize;
  cursor: pointer;
}
.send_message {
  display: flex;
}
.indicator {
  position: absolute;
  right: 0%;
  top: 0%;
}
.card_container {
}
</style>
