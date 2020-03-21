<template functional>
  <div class="title_wrapper" :class="props.defaultClass">
    <component v-if="title" :is="tag">{{ props.title }}</component>
    <p v-if="subtitle" class="desc mb-2" v-html="props.subtitle"></p>
    <slot></slot>
  </div>
</template>

<script>
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
  }
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
