<template functional>
  <div class="message_container flex" :class="{ sender: props.data.isSender }">
    <div
      class="message"
      :data-timestamp="props.data.sentAt"
      :class="{ sender: props.data.isSender }"
    >
      <p>{{ props.data.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",

  props: {
    data: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.message_container {
  justify-content: flex-start;
  padding: 10px;
  width: 100%;
  &.sender {
    justify-content: flex-end;
  }
}
.message {
  background: whitesmoke;
  color: #4444;
  margin: 20px 30px 0 0;
  max-width: 300px;
  padding: 10px;
  word-break: normal;
  &:after {
    color: white;
    content: attr(data-timestamp);
    font-size: 0.6em;
  }
  &.sender {
    background: grey;
    border-radius: 20px;
    border-bottom-right-radius: 0px;
    color: white;
  }
}
</style>
