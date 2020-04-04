<template>
  <div
    class="transcript_container"
    :class="{ active: activeChat }"
    @click="UPDATE_ACTIVE_TRANSCRIPT(transcriptInformation._id)"
  >
    <Avatar :name="usersInformation.userTwo" />
    <div class="text_container">
      <p v-if="!transcriptInformation.hasOwnProperty('initChat')">
        {{ truncate(transcriptInformation.lastMessage.content) }}
      </p>
      <p v-else>New Message</p>
      <small class="grey">{{
        initMoment(transcriptInformation.dateUpdated).calendar()
      }}</small>
    </div>
    <div class="chat_extension_container">
      <div v-if="activeChat" class="delete_chat_container">
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
  name: "Transcript",
  components: {
    Avatar: () => import("@/components/Avatar")
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    ...mapGetters("Admin", ["getUserInformation"]),
    activeChat() {
      return this.activeTranscript._id == this.transcriptInformation._id;
    },
    usersInformation() {
      let { userOne, userTwo } = this.activeTranscript;
      return {
        userOne: this.getUserInformation(userOne)?.name,
        userTwo: this.getUserInformation(userTwo)?.name
      };
    }
  },
  props: {
    transcriptInformation: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"]),
    ...mapActions("Comms", ["getTranscripts"]),
    deleteChat() {
      this.request({
        method: "DELETE",
        url: "messenger/transcripts",
        data: { _id: this.transcriptInformation._id }
      })
        .then(() => {
          this.loading = false;
          this.getTranscripts();
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
