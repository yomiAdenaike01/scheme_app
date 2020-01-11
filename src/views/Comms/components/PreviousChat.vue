<template>
  <div v-if="transcripts.length > 0">
    <div
      class="previous_chat p-3"
      @click="getMessages(transcript)"
      v-for="transcript in transcripts"
      :key="transcript._id"
    >
      <el-row type="flex" justify="space-between" align="top">
        <el-col style="flex:1" class="mr-4">
          <Avatar :name="findUser" />
        </el-col>
        <el-col>
          <span>{{ transcript.message.content }}</span>
          <br />
          <span class="grey">{{ calendar(transcript.updated_at) }}</span>
        </el-col>
        <el-col class="icon_container">
          <i
            v-if="activeTranscript._id == transcript._id"
            class="chat_indicator el-icon-circle-close"
            @click="deleteTranscript(transcript)"
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

  created() {
    this.getTranscripts();
  },
  computed: {
    ...mapState("Comms", ["transcripts", "activeTranscript"]),
    ...mapState("Admin", ["team"]),
    ...mapState(["currentUser"]),
    findUser() {
      let transcripts = this.transcripts;
      let len = transcripts.length;
      let user;
      for (let i = 0; i < len; i++) {
        const transcript = transcripts[i];
        user = this.team.find(x => {
          return transcript.user_1 == x._id;
        });
      }

      if (user) return user.name;
      return "John Doe";
    }
  },
  methods: {
    ...mapMutations("Comms", [
      "UPDATE_ACTIVE_TRANSCRIPT",
      "UPDATE_MESSAGES",
      "UPDATE_START_NEW_CHAT"
    ]),
    ...mapActions(["request"]),
    ...mapActions("Comms", ["getTranscripts"]),
    deleteTranscript(transcript) {
      this.$confirm(
        "This will permanently delete the transcript. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      ).then(() => {
        const payload = {
          method: "DELETE",
          url: "/messenger/transcripts",
          data: { transcript_id: transcript._id }
        };
        this.request(payload).then(response => {
          window.location.reload();
        });
      });
    },
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
        .catch(error => {});
    }
  },
  mixins: [dates],
  components: {
    Avatar: () => import("@/components/Avatar")
  }
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
  color: $primary_colour;
  font-size: 1.3em;
}
.icon_container {
  display: flex;
  justify-content: center;
  flex: 1;
}
.light {
  color: #999;
  text-align: center;
}
</style>
