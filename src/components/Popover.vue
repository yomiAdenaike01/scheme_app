<template>
  <el-popover
    :popper-class="popperclass"
    :placement="position"
    :trigger="trigger"
    :title="title"
    :width="width"
  >
    <slot name="content"></slot>
    <slot name="trigger" slot="reference"></slot>
  </el-popover>
</template>

<script>
export default {
  name: "Popover",
  props: {
    popperclass: {
      type: String,
      default: "popover_container"
    },
    width: String,
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

<style></style>
