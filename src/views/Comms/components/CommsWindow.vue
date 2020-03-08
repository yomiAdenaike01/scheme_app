<template>
  <transition name="el-fade-in">
    <div class="comms_window_container">
      <div class="comms_window_toolbar">
        <p>{{ info.otherUsername }}</p>
      </div>
      <div class="messages_container">
        <div class="input_container">
          <el-input
            class="chat_input"
            v-model="chat.content"
            type="textarea"
          ></el-input>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Message from "./Message";
import { mapState } from "vuex";
export default {
  name: "CommsWindow",
  data() {
    return {
      chat: {
        content: ""
      }
    };
  },
  computed: {
    ...mapState("Comms", ["activeTranscript"]),
    info() {
      return this.activeTranscript.extraInfo;
    }
  },
  components: {
    Message
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
  box-shadow: 0px 4px 10px whitesmoke;
}
.messages_container {
  position: relative;
  height: 100%;
}
.input_container {
  position: absolute;
  bottom: 10%;
  right: 0;
  left: 0;
  background: red;
}
.chat_input {
  font-size: 15px;
  &/deep/ {
    textarea {
      border: none;
      outline: none;
    }
  }
}
</style>
