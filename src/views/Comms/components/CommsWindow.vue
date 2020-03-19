<template>
  <transition name="el-fade-in">
    <div class="comms_window_container flex columns" v-loading="loading">
      <div class="messages_container" v-if="hasEntries(activeTranscript)">
        <!-- Comms toolbar -->
        <CommsToolbar :recieverInformation="info" />
        <!-- Messages -->
        <Message
          v-for="(message, index) in messages"
          :data="message"
          :key="
            `${index}${Math.random()
              .toString(16)
              .slice(2)}`
          "
        />
        <!-- Message input -->
        <div class="input_container flex">
          <div class="actions_container">
            <Popover trigger="click">
              <i class="bx bx-plus grey show_actions" slot="trigger"></i>
              <div class="flex flex--start columns" slot="content">
                <el-button>
                  <i class="bx bx-plus"></i>Add attachment
                </el-button>
              </div>
            </Popover>
          </div>
          <el-input clearable class="chat_input" v-model="chat.content" type="textarea"></el-input>
          <el-button @click="prepareSendMessage" plain type="primary">Send</el-button>
        </div>
      </div>
      <!-- Information display -->
      <div v-else class="no_content_container">
        <InformationDisplay v-bind="infoDisplay" />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions } from "vuex";

import Message from "./Message";
import CommsToolbar from "./CommsToolbar";

import Popover from "@/components/Popover";
import InformationDisplay from "@/components/InformationDisplay";

export default {
  name: "CommsWindow",
  data() {
    return {
      loading: false,
      messagesInterval: null,
      chat: {
        content: "",
        attachments: ""
      }
    };
  },
  activated() {
    clearInterval(this.messagesInterval);
    this.messagesInterval = setInterval(() => {
      this.getMessages();
    }, this.requestIntervals.messages);
  },
  deactivated() {
    clearInterval(this.messagesInterval);
  },
  components: {
    Message,
    CommsToolbar,
    Popover,
    InformationDisplay
  },
  computed: {
    ...mapState(["requestIntervals"]),
    ...mapState("Comms", ["activeTranscript", "messages"]),
    infoDisplay() {
      return {
        text: "No chat selected",
        icon: "bx bx-conversation"
      };
    },
    info() {
      return this.activeTranscript?.userInfo;
    },

    isMuted() {
      return (
        this.activeTranscript.mutedNotifications.indexOf(this.userInformation) >
        -1
      );
    }
  },
  methods: {
    ...mapActions("Comms", ["getMessages", "sendMessage", "readMessages"]),

    prepareSendMessage() {
      this.loading = true;

      let messagePayload = {
        ...this.chat,
        recieverID: this.activeTranscript.userTwo,
        transcriptID: this.activeTranscript._id,
        isMuted: this.isMuted
      };
      this.chat.content = "";

      this.sendMessage(messagePayload)
        .then(response => {
          this.loading = false;
          this.UPDATE_MESSAGES(response);
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.comms_window_container {
  flex: 1;
}
.messages_container {
  position: relative;
  flex: 1;
}
.input_container {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  border-top: $border;
  border-bottom: $border;
  flex: 1;
}
.chat_input {
  font-size: 15px;
  height: 100%;
  &/deep/ {
    textarea {
      background: transparent;
      border: none;
      outline: none;
    }
  }
}
.actions_container {
  border-right: $border;
  padding: 20px;
  cursor: pointer;
}
.show_actions {
  font-size: 1.5em;
}
.no_content_container {
  background: rgb(253, 253, 253);
  flex: 1;
  color: #ccc;
}
</style>
