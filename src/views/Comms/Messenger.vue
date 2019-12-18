<template>
  <el-row style="height:100%">
    <el-col :span="5">
      <PreviousChat
        v-for="transcript in transcripts"
        :transcriptData="transcript"
        :key="transcript._id"
        @chatData="getMessages"
      />
    </el-col>
    <el-container style="height:100%">
      <el-main style="height:90%" v-if="messages.length > 0">
        <Message v-for="message in messages" :key="message._id" :message="message" />
      </el-main>
      <el-main v-else class="no_messages_container">
        <h1>Select a conversation to view the messages.</h1>
      </el-main>
    </el-container>
    <!-- <el-row type="flex" justify="center" align="center">
        <el-col :span="20">
          <el-input placeholder="Message Content" v-model="message.content" />
        </el-col>
        <el-button
          v-loading="loading"
          icon="el-icon-s-promotion"
          @click="sendMessage"
          class="ml-3"
        />
    </el-row>-->
  </el-row>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "Messenger",

  data() {
    return {
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
    ...mapState(["transcripts", "team"])
  },
  methods: {
    ...mapActions(["request"]),
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
            message: "Error when getting messages, please try again later"
          });
        });
    },
    sendMessage() {}
  },
  components: {
    PreviousChat: () => import("./components/PreviousChat"),
    Message: () => import("./components/Message")
  }
};
</script>

<style lang="scss" scoped>
.no_messages_container {
  background: #f9f9f9;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>