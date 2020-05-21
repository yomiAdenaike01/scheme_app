<template functional>
  <div class="message_container" :class="{ is_user: props.isSentByUser }">
    <div class="message" :class="{ not_user: !props.isSentByUser }">
      <p>
        {{ props.content }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",

  props: {
    sentBy: {
      type: String
    },
    sentAt: {
      type: String
    },
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
    },
    id: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="scss" scoped>
.message_container {
  &:first-of-type {
    border: none;
  }
  border-top: $border;
  display: flex;
  height: inherit;
  flex-direction: column;
  align-items: flex-start;
  max-height: 150px;
  margin: 5px;
  padding: 10px;

  &.is_user {
    align-items: flex-end;
    .message {
      color: white;
      background: var(--colour_secondary);
      border-bottom-right-radius: 0px;
    }
  }
}
.user {
  text-transform: capitalize;
  padding: 0;
  margin: 0;
  font-size: 0.8em;
  margin-bottom: 10px;
}
.message {
  background: whitesmoke;
  padding: 15px;
  color: #555;

  display: flex;
  border-radius: 30px;
  transition: $default_transition transform;
  will-change: transform;
  margin-left: 20px;
  &.not_user {
    margin-right: 20px;
    border-bottom-left-radius: 0px;
  }
}
</style>
