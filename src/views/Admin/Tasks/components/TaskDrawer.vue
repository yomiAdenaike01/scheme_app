<template>
  <el-drawer :visible.sync="view">
    <div class="task_drawer_container">
      {{ taskInformation }}
    </div>
  </el-drawer>
</template>

<script>
export default {
  name: "TaskDrawer",
  props: {
    display: {
      type: Boolean,
      default: false
    },
    taskInformation: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("toggle", false);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.task_drawer_container {
  padding: 20px;
}
</style>
