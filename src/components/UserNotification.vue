<template functional>
  <div
    class="notification"
    :class="{ read: props.notification.status == 'is_read' }"
    @click="listeners.click"
  >
    <div class="notification_header">
      <i :class="`bx bx-${props.notification.icon}`"></i>
      <div class="text_container">
        <strong>{{ props.notification.title }}</strong>
        <p>{{ props.notification.message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserNotification",
  props: {
    notification: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.notification {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid whitesmoke;
  max-height: fit-content;
  &:hover {
    background: rgb(250, 250, 250);
  }
  &.is_read {
    opacity: 0.8;
    cursor: not-allowed;
  }
}
.notification_header {
  display: flex;
  align-items: center;
  .bx {
    border-radius: 50%;
    padding: 10px;
    box-shadow: $box_shadow;
    font-size: 1.2em;
    margin-right: 10px;
  }
}
.text_container {
  p {
    padding: 0;
    margin: 0;
  }
}
</style>
