<template functional>
  <transition name="fade-transform" mode="out-in">
    <slot></slot>
  </transition>
</template>

<script>
export default {
  name: "DefaultTransition"
};
</script>

<style></style>
