<template>
  <el-collapse class="m-3">
    <el-collapse-item :title="title">
      <div :class="center ? 'flex_center' : ''">
        <slot></slot>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: "ToggleSlideDown",
  props: {
    center: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: () => {
        return "Title";
      }
    }
  }
};
</script>

<style>
</style>