<template>
  <transition name="el-fade-in">
    <div class="comms_window_container flex columns">
      <div class="messages_container" v-if="hasEntries(activeTranscript)">
        <div class="comms_window_toolbar">
          <p>{{ username }}</p>
        </div>
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
                <el-button><i class="bx bx-plus"></i>Add attachment</el-button>
              </div>
            </Popover>
          </div>
          <el-input
            clearable
            class="chat_input"
            v-model="chat.content"
            type="textarea"
          ></el-input>
          <el-button
            v-loading="loading"
            @click="prepareSendMessage"
            plain
            type="primary"
            >Send</el-button
          >
        </div>
      </div>
      <Nocontent v-else v-bind="noContent" />
    </div>
  </transition>
</template>

<script>
import Popover from "@/components/Popover";
import Message from "./Message";
import Nocontent from "@/components/Nocontent";
import { mapState, mapActions } from "vuex";
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

  deactivated() {
    clearInterval(this.messagesInterval);
  },
  async activated() {
    await this.getMessages();
    this.readMessages();
    clearInterval(this.messagesInterval);
    this.messagesInterval = setInterval(() => {
      this.getMessages();
    }, this.requestIntervals.messages);
  },
  computed: {
    ...mapState(["requestIntervals"]),
    ...mapState("Comms", ["activeTranscript", "messages"]),
    noContent() {
      return {
        text: "No chat selected",
        icon: "bx bx-conversation"
      };
    },
    info() {
      return this.activeTranscript.userInfo;
    },
    username() {
      return this.info?.name ?? "John Doe";
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
        userName: this.username,
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
          return;
        });
    }
  },
  components: {
    Message,
    Popover,
    Nocontent
  }
};
</script>

<style lang="scss" scoped>
.comms_window_container {
  flex: 1;
  color: grey;
}
.comms_window_toolbar {
  border-bottom: $border;
  padding: 10px;
  width: 100%;
  pointer-events: none;
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
</style>
