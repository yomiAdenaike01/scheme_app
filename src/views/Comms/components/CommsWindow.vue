<template>
  <transition name="el-fade-in">
    <div
      v-loading="transcriptLoading"
      class="comms_window_container flex columns"
    >
      <div v-if="hasEntries(activeTranscript)" class="messages_container">
        <!-- Comms toolbar -->
        <CommsToolbar :reciever-information="info" />
        <!-- Messages -->
        <Message
          v-for="(message, index) in messages"
          :key="
            `${index}${Math.random()
              .toString(16)
              .slice(2)}`
          "
          :data="{
            ...message,
            isSender: message.senderID == userInformation._id,
            sentAt: initMoment(message.sentAt).calendar()
          }"
        />
        <!-- Message input -->
        <div class="input_container flex">
          <div class="actions_container">
            <Popover trigger="click">
              <i slot="trigger" class="bx bx-plus grey show_actions"></i>
              <div slot="content" class="flex flex--start columns">
                <el-button>
                  <i class="bx bx-plus"></i>Add attachment
                </el-button>
              </div>
            </Popover>
          </div>
          <el-input
            v-model="chatInformation.content"
            clearable
            class="chat_input"
            type="textarea"
          ></el-input>
          <el-button plain type="primary" @click="prepareSendMessage"
            >Send</el-button
          >
        </div>
      </div>
      <!-- Information display -->
      <div v-else class="no_content_container">
        <p>No data</p>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import Message from "./Message";
import CommsToolbar from "./CommsToolbar";
import CommsEventBus from "./CommsEventBus";

import Popover from "@/components/Popover";

export default {
  name: "CommsWindow",
  components: {
    Message,
    CommsToolbar,
    Popover
  },
  data() {
    return {
      messagesInterval: null,
      transcriptError: true,
      chatInformation: {
        content: "",
        attachments: ""
      }
    };
  },

  activated() {
    this.messagesInterval = setInterval(() => {
      this.getMessages();
    }, this.requestIntervals.messages);
  },
  deactivated() {
    clearInterval(this.messagesInterval);
  },
  computed: {
    ...mapState(["requestIntervals", "userInformation"]),
    ...mapState("Comms", ["activeTranscript", "messages", "transcriptLoading"]),
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
    ...mapMutations("Comms", ["UPDATE_ACTIVE_TRANSCRIPT"]),

    prepareSendMessage() {
      this.loading = true;

      let messagePayload = {
        ...this.chatInformation,
        recieverID: this.activeTranscript.userTwo,
        transcriptID: this.activeTranscript._id,
        isMuted: this.isMuted
      };

      this.chatInformation.content = "";

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
.chatInformation_input {
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
