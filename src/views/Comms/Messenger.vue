<template>
  <el-row style="height:100%">
    <el-col :span="5" class="chatinfo_container">
      <StartNewChat v-model="searches.transcriptSearch" />
      <PreviousChat
        v-for="transcript in searchedTranscripts"
        :transcriptData="transcript"
        :key="transcript._id"
        @chatData="getMessages"
      />
    </el-col>
    <el-container style="height:100%">
      <!-- TODO: CONVERT TO COMPONENT -->
      <div class="chat_body" v-show="messages.length > 0">
        <el-main>
          <Message v-for="message in messages" :key="message._id" :message="message" />
        </el-main>
        <div class="chat_sender_container">
          <el-input v-model="message.content" placeholder="Message Content...." />
          <el-button icon="el-icon-s-promotion" @click="sendMessage" v-loading="loading" />
        </div>
      </div>
      <el-main v-show="messages.length <= 0" class="no_messages_container">
        <h1>Select a conversation to view the messages.</h1>
      </el-main>
    </el-container>
  </el-row>
</template>

<script>
import StartNewChat from "./components/StartNewChat";
import { mapActions, mapState } from "vuex";
export default {
  name: "Messenger",

  data() {
    return {
      searches: {
        messageSearch: "",
        transcriptSearch: ""
      },
      messages: [],
      message: {
        content: "",
        attachments: "",
        transcript_id: "",
        reciever_id: ""
      },
      loading: false
    };
  },

  computed: {
    ...mapState(["transcripts", "team"]),
    searchedTranscripts() {
      let transcripts = this.transcripts;
      let search = this.searches.transcriptSearch;
      // Search the users and return their ids
      let team = this.team;
      let user2 = team.find(member => {
        if (search == member.name) {
          return member.id;
        }
      });
      if (user2) {
        return transcripts.filter(transcript => {
          return transcript.user_2 == user2;
        });
      }
      return transcripts;
    },
    searchedMessages() {
      let messages = this.messages;
      const searchQuery = this.searchQuery;
      messages.filter(x => {
        return x.content == searchQuery;
      });
    }
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    ...mapActions(["request"]),
    scrollToBottom() {
      var messageDisplay = document.getElementsByTagName("main")[0];
      if (this.messages.length > 0) {
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
      }
    },
    getMessages(event) {
      const message = this.message;
      message.transcript_id = event.id;
      message.reciever_id = event.reciever;

      const payload = {
        method: "POST",
        url: "/messenger/messages",
        data: { transcript_id: message.transcript_id }
      };
      this.request(payload)
        .then(response => {
          this.messages = response;
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error.message
          });
        });
    },
    sendMessage() {
      this.loading = true;
      const payload = {
        method: "POST",
        data: this.message,
        url: "/messenger/send"
      };
      this.request(payload)
        .then(response => {
          this.messages.push(response);
          this.message.content = "";
          this.loading = false;
          this.scrollToBottom();
        })
        .catch(error => {
          this.$notify.error({
            title: "Error",
            message: error.message
          });
        });
    }
  },
  components: {
    PreviousChat: () => import("./components/PreviousChat"),
    Message: () => import("./components/Message"),
    StartNewChat
  }
};
</script>

<style lang="scss" scoped>
.chatinfo_container {
  height: 100%;
  background: #fdfdfd;
  border-right: 1px solid #e6e6e6;
}
.no_messages_container {
  background: #f9f9f9;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.chat_body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90%;
}
.chat_sender_container {
  display: flex;
  padding: 1.5em;
}
</style>