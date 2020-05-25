<template functional>
  <div class="floating_item">
    <div
      class="online_container"
      :class="{ online: props.isOnline, not_online: !props.isOnline }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "OnlineIndicator",
  props: {
    isOnline: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="scss" scoped>
.floating_item {
  @include floating_item;
  display: flex;
  background: white;
  padding: 0;
  min-width: 26%;
  min-height: 26%;
  top: 70%;
  right: 0px;
  padding: 3px;
}
.online_container {
  display: flex;
  flex: 1;
  padding: 5px;
  border-radius: 50%;

  &.online {
    background: rgba(var(--success), 1);
  }
  &.not_online {
    background: rgba(var(--danger), 1);
  }
}
</style>
