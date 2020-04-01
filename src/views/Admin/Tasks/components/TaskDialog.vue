<template>
  <el-dialog :visible.sync="view">
    <div class="task_dialog_container"></div>
  </el-dialog>
</template>

<script>
export default {
  name: "TaskDialog",
  computed: {
    view: {
      get() {
        return this.getActiveDialog("task").view;
      },
      set() {
        this.closeDialog("task");
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.task_dialog_container {
  display: flex;
  flex: 1;
}
</style>
