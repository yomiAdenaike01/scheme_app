<template>
  <el-popover :placement="position" trigger="hover" :title="title">
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
    }
  }
};
</script>

<style>
</style>