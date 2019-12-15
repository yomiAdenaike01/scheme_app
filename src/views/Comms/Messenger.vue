<template>
  <el-row>
    <el-col :span="5" class="p-4">
      <PreviousChat
        v-for="transcript in transcripts"
        :transcriptData="transcript"
        :key="transcript._id"
        @chatData="getMessages"
      />
    </el-col>
    <el-col :span="17" style="rgb(250,250,250)">
      <Message v-for="message in messages" :key="message._id" :message="message" />
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
    </el-col>
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
  created() {
    this.getTeam();
    this.getTranscripts();
  },
  computed: {
    ...mapState(["transcripts", "team"])
  },
  methods: {
    ...mapActions(["request", "getTeam", "getTranscripts"]),
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

<style>
</style>