<template>
  <div class="chat_window_container" v-loading="false">
    <div class="banner p-2">
      <!-- <Avatar :name="returnTeamMember.name" /> -->
    </div>
    <transition-group name="el-fade-in">
      <ChatMessage
        v-for="message in messages"
        :key="message._id"
        :message="message"
      />
    </transition-group>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import ChatMessage from "./ChatMessage";
import Avatar from "@/components/Avatar";
import findTeam from "@/mixins/findTeam";
export default {
  name: "ChatWindow",
  mixins: [findTeam],
  data() {
    return {
      getMessagesInterval: null,
      messages: [],
      loading: true
    };
  },
  created() {
    this.getMessages({ transcript_id: this.activeTranscript._id })
      .then(response => {
        this.messages = response;
        this.loading = false;
      })
      .catch(error => {
        console.log(error);
        this.loading = false;
      });
  },
  mounted() {
    this.getMessagesInterval = setInterval(() => {
      this.getMessages({ transcript_id: this.activeTranscript._id })
        .then(response => {
          this.messages = response;
        })
        .catch(error => {
          console.log(error);
        });
    }, 10000);
  },
  destroyed() {
    clearInterval(this.getMessagesInterval);
  },

  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    returnTeamMember() {
      return this.findTeamMember(this.activeTranscript.user_2);
    }
  },
  methods: {
    ...mapActions("Comms", ["getMessages"])
  },
  components: {
    ChatMessage,
    Avatar
  }
};
</script>

<style lang="scss" scoped>
.chat_window_container {
  height: 100%;
  width: 100%;
}
.banner {
  border-bottom: 1.5px solid #efefef;
}
</style>
