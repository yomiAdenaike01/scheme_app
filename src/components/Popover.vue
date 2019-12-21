<template>
  <el-popover placement="top-start" trigger="hover" :title="title">
    <slot name="content"></slot>
    <slot name="trigger" slot="reference"></slot>
  </el-popover>
</template>

<script>
export default {
  name: "Popover",
  props: {
    title: String
  }
};
</script>

<style>
</style>