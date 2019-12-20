<template>
  <div>
    <div
      class="previous_chat"
      @click="getMessages(transcript)"
      v-for="transcript in transcripts"
      :key="transcript._id"
    >
      <div class="grid p-2">
        <el-avatar class="mr-4" icon="el-icon-user-solid"></el-avatar>
        <div class="icon_wrapper_grid">
          <div class="grid_content">
            <span>{{transcript.message.content}}</span>
            <br />
            <span class="grey">{{calendar(transcript.updated_at)}}</span>
          </div>
          <i
            v-if="activeTranscript._id == transcript._id "
            class="chat_indicator el-icon-chat-dot-round"
          ></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dates from "@/mixins/dates";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "PreviousChat",
  computed: {
    ...mapState(["transcripts", "activeTranscript"])
  },
  methods: {
    ...mapMutations(["UPDATE_ACTIVE_TRANSCRIPT", "UPDATE_MESSAGES"]),
    ...mapActions(["request"]),

    getMessages(event) {
      this.UPDATE_ACTIVE_TRANSCRIPT(event);
      const payload = {
        method: "POST",
        url: "/messenger/messages",
        data: { transcript_id: event._id }
      };
      this.request(payload)
        .then(response => {
          this.UPDATE_MESSAGES({ messages: response, event: "equal" });
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error.message
          });
        });
    }
  },
  mixins: [dates]
};
</script>

<style lang="scss" scoped>
.previous_chat {
  cursor: pointer;
  border-bottom: 1px solid #e6e6e6;
  &:hover {
    background: whitesmoke;
  }
}
.grid {
  display: flex;
}
.icon_wrapper_grid {
  display: flex;
  justify-content: space-between;
  width: 60%;
}
.grey {
  font-size: 0.8em;
}
.chat_indicator {
  color: #2f74eb;
  font-size: 1.3em;
}
</style>