<template>
  <div class="title_wrapper" :class="defaultClass">
    <component v-if="title" :is="tag">{{ title }}</component>
    <p v-if="subtitle" class="desc mb-2">{{ subtitle }}</p>
    <slot></slot>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Title",

  props: {
    tag: {
      type: String,
      default: "h2"
    },
    defaultClass: {
      type: String,
      default: "m-3"
    },
    title: String | Number,
    subtitle: String | Number
  },
  computed: { ...mapState(["defaultSize"]) }
};
</script>
<style lang="scss" scoped>
.title_wrapper {
  color: black;
  &.m-0 {
    margin: 0;
  }

  &.p-0 {
    padding: 0;
  }
}
</style>
