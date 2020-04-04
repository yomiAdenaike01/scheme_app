<template>
  <div
    class="transcript_container"
    :class="{ active: activeTranscript._id == transcriptInformation._id }"
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
export default {
  name: "Transcript",
  components: {
    Avatar: () => import("@/components/Avatar")
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    ...mapGetters("Admin", ["getUserInformation"]),
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
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"])
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
</style>
