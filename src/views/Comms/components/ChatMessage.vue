<template functional>
  <div class="message_container" :class="{ is_user: props.isSentByUser }">
    <p class="user">{{ props.sentBy }}</p>
    <div class="message" :class="{ not_user: !props.isSentByUser }">
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
  border-top: 2px solid whitesmoke;
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
      background: lighten($color: $default_colour, $amount: 30);
      border-bottom-right-radius: 0px;
    }
  }
}
.user {
  text-transform: capitalize;
  padding: 0;
  margin: 0;
  font-size: 0.9em;
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
