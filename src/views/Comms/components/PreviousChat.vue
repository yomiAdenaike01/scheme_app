<template>
  <div v-if="transcripts.length > 0">
    <div
      class="previous_chat p-3"
      @click="getMessages(transcript)"
      v-for="transcript in transcripts"
      :key="transcript._id"
    >
      <el-row type="flex" justify="space-between" align="top">
        <el-col>
          <el-avatar icon="el-icon-user"></el-avatar>
        </el-col>
        <el-col>
          <span>{{transcript.message.content}}</span>
          <br />
          <span class="grey">{{calendar(transcript.updated_at)}}</span>
        </el-col>
        <el-col class="icon_container">
          <i
            v-if="activeTranscript._id == transcript._id "
            class="chat_indicator el-icon-chat-dot-round"
          ></i>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-container v-else @click="UPDATE_START_NEW_CHAT(true)">
    <el-main>
      <h4 class="light">Press new chat to start a new conversation.</h4>
    </el-main>
  </el-container>
</template>

<script>
import dates from "@/mixins/dates";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "PreviousChat",
  computed: {
    ...mapState("Comms", ["transcripts", "activeTranscript"])
  },
  methods: {
    ...mapMutations("Comms", [
      "UPDATE_ACTIVE_TRANSCRIPT",
      "UPDATE_MESSAGES",
      "UPDATE_START_NEW_CHAT"
    ]),
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
.icon_container {
  display: flex;
  justify-content: center;
}
.light {
  color: #999;
  text-align: center;
}
</style>