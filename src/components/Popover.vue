<template>
  <el-popover
    :popper-class="popperclass"
    :placement="position"
    :trigger="trigger"
    :title="title"
    :width="width"
  >
    <slot name="content"></slot>
    <slot slot="reference" name="trigger"></slot>
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
