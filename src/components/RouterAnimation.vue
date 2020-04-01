<template>
  <transition name="fadeLeft" mode="out-in">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "RouterAnimation"
};
</script>

<style lang="scss" scoped>
.animation_wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
