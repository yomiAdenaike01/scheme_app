<template functional>
  <div class="message_container" :class="{ is_user: props.isSentByUser }">
    <div class="message">
      <p>
        {{ props.content }}
        <small class="grey">{{ props.sentAt }}</small>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    isSentByUser: {
      type: Boolean,
      default: false
    },
    hasAttachments: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.message_container {
  display: flex;
  flex: 1;
  justify-content: flex-start;
  width: 100%;

  &.is_user {
    justify-content: flex-end;
    .message {
      background: whitesmoke;
      color: #555;
      border-top-right-radius: 0px;
      &:hover {
        transform: translateX(-10px);
      }
    }
  }
}
.message {
  background: red;
  color: white;
  padding: 20px;
  display: flex;
  height: 50px;
  margin: 10px;
  max-height: 450px;
  border-top-left-radius: 0px;
  border-radius: 10px;
  transition: $default_transition transform;
  will-change: transform;
  &:hover {
    transform: translateX(10px);
  }
}
</style>
