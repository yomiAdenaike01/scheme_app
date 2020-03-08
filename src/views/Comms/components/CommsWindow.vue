<template>
  <transition name="el-fade-in">
    <div class="comms_window_container flex columns">
      <div class="comms_window_toolbar">
        <p>{{ username }}</p>
      </div>
      <div class="messages_container">
        <transition-group name="el-fade-in">
          <Message
            v-for="(message, index) in messages"
            :data="message"
            :key="index"
          />
        </transition-group>
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
    </div>
  </transition>
</template>

<script>
import Popover from "@/components/Popover";
import Message from "./Message";
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
    info() {
      return this.activeTranscript.userInfo;
    },
    username() {
      return this.info?.name ?? "John Doe";
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
        userName: this.username
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
    Popover
  }
};
</script>

<style lang="scss" scoped>
.comms_window_container {
  width: 100%;
  height: 100%;
  color: grey;
}
.comms_window_toolbar {
  border-bottom: $border;
  padding: 10px;
  width: 100%;
  pointer-events: none;
  //   box-shadow: 0px 4px 10px whitesmoke;
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
