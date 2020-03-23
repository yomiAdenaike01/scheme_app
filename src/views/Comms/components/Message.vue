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
