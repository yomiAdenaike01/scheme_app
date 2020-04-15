<template functional>
  <div class="message_container" :class="{ is_user: props.isSentByUser }">
    <div class="message">
      <p>
        {{ props.content }}
      </p>
    </div>
    <div v-if="props.isSentByUser" class="actions_container">
      <el-button
        icon="el-icon-edit-outline"
        title="Edit message"
        circle
        @click="listeners['editMessage'](props.id)"
      ></el-button>
      <el-button
        title="Delete message"
        icon="el-icon-delete"
        circle
        @click="listeners['deleteMessage'](props.id)"
      ></el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
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
  display: flex;
  height: inherit;
  flex-direction: column;
  align-items: flex-start;
  max-height: 150px;
  margin: 5px;

  &.is_user {
    align-items: flex-end;
    .message {
      background: whitesmoke;
      color: #555;
      border-top-right-radius: 0px;
    }
  }
}
.message {
  background: lighten($color: $default_colour, $amount: 30);
  color: white;
  padding: 5px;
  display: flex;

  border-radius: 10px;
  border-bottom-left-radius: 0px;
  transition: $default_transition transform;
  will-change: transform;
}
.message_container:hover .actions_container {
  opacity: 1;
}
.actions_container {
  display: flex;
  opacity: 0;
  transition: $default_transition opacity;
  will-change: opacity;
}
</style>
