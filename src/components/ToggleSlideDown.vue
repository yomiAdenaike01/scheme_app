<template functional>
  <el-collapse>
    <el-collapse-item :title="title">
      <div
        slot="title"
        class="flex slidedown_title_content flex--space-between mr-4"
      >
        <p>{{ props.title }}</p>
        <slot name="titleContent"></slot>
      </div>
      <div :class="props.center ? 'flex_center' : ''">
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

<style lang="scss" scoped>
.slidedown_title_content {
  width: 100%;
}
</style>
