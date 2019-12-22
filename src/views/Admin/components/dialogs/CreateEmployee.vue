<template>
  <el-dialog :visible.sync="view"> </el-dialog>
</template>

<script>
export default {
  name: 'CreateEmployee',
  props: {
    display: Boolean
  },
  computed: {
    view: {
      get() {
        return this.display
      },
      set(toggle) {
        this.$emit('toggle', toggle)
      }
    }
  }
}
</script>

<style></style>
