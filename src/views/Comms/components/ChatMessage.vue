<template functional>
  <div class="message_container" :class="{ userMessage }">
    <div class="message">
      {{ props.content }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Message",
  props: {
    userMessage: {
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
}
</style>
