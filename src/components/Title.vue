<template>
  <div class="title_wrapper" :class="defaultClass">
    <h1 class="m-0 p-0" v-if="title">{{ title }}</h1>
    <span v-if="subtitle" class="grey">{{ subtitle }}</span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    defaultClass: {
      type: String,
      default: 'm-3'
    },
    title: String,
    subtitle: String
  }
}
</script>
<style lang="scss" scoped>
span {
  font-size: 0.8em;
  margin-top: -20px;
}
</style>
