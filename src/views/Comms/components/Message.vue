<template>
  <div class="message_container flex" :class="{ sender: isSender }">
    <div
      class="message"
      :data-timestamp="initMoment(data.sentAt).calendar()"
      :class="{ sender: isSender }"
    >
      <p>{{ data.content }}</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Message",
  computed: {
    ...mapState(["userInformation"]),
    isSender() {
      return this.data.senderID == this.userInformation._id;
    }
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.message_container {
  width: 100%;
  padding: 10px;
  justify-content: flex-start;
  &.sender {
    justify-content: flex-end;
  }
}
.message {
  max-width: 300px;
  word-break: normal;
  margin: 20px 30px 0 0;
  padding: 10px;
  background: whitesmoke;
  color: #4444;
  &:after {
    content: attr(data-timestamp);
    color: white;
    font-size: 0.6em;
  }
  &.sender {
    color: white;
    background: grey;
    border-radius: 20px;
    border-bottom-right-radius: 0px;
  }
}
</style>
