<template>
  <el-popover :placement="position" :trigger="trigger" :title="title">
    <slot name="content"></slot>
    <slot name="trigger" slot="reference"></slot>
  </el-popover>
</template>

<script>
export default {
  name: "Popover",
  props: {
    title: String,
    position: {
      type: String,
      default: "top-start"
    },
    trigger: {
      type: String,
      default: "hover"
    }
  }
};
</script>

<style>
</style>