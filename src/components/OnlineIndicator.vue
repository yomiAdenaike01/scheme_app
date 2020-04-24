<template functional>
  <div class="floating_item">
    <div class="online_container" :class="{ online: props.is_online }"></div>
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
  min-width: 25%;
  min-height: 25%;
  top: 5px;
  right: 0px;
  padding: 2px;
}
.online_container {
  display: flex;
  flex: 1;
  border-radius: 50%;
  background: $error_colour;

  &.online {
    background: $success_colour;
  }
}
</style>
