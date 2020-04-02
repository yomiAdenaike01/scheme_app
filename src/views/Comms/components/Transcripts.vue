<template>
  <div
    class="transcript_container"
    :class="{ no_content: transcripts.length == 0 }"
  >
    <!-- Search for transcripts -->
    <div v-if="hasEntries(transcripts)">
      <el-input v-model="transcriptSearch" placeholder="Search chats" />
      <Transcript
        v-for="transcript in transcripts"
        :key="transcript._id"
        :transcript-information="transcript"
      />
    </div>

    <InformationDisplay
      v-else
      class="no_content"
      :display-text="{
        heading: 'No previous messages',
        content: 'Press the button below to start a new chat',
        icon: 'bx bx-message-group',
        hasIcon: true
      }"
    >
      <el-button
        slot="body"
        circle
        type="text"
        icon="el-icon-plus"
        @click="startNewChat"
      ></el-button>
    </InformationDisplay>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Transcripts",
  components: {
    InformationDisplay: () => import("@/components/InformationDisplay"),
    Transcript: () => import("./Transcript")
  },
  data() {
    return {
      transcriptSearch: ""
    };
  },
  computed: {
    ...mapState("Comms", ["transcripts"]),
    ...mapState(["userInformation"])
  },
  methods: {
    ...mapMutations("Comms", ["UPDATE_TRANSCRIPTS"]),
    startNewChat() {
      // Create a fake chat
      this.UPDATE_TRANSCRIPTS(
        {
          userOne: this.userInformation._id,
          userTwo: Math.random()
            .toString(16)
            .slice(2),
          dateCreated: new Date().toISOString()
        },
        true
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.transcript_container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgb(252, 252, 252);
  flex: 0.2;
  border-right: 2px solid whitesmoke;
  position: relative;
  &.no_content {
    justify-content: center;
    align-items: center;
  }
}
</style>
