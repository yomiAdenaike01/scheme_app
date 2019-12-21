<template>
  <el-dialog :visible.sync="displayModal" title="Add Employee">
    <el-form>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
      <el-form-item>
        <p>hello</p>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: "StaffAddEmployeeDialog",
  props: {
    display: Boolean
  },
  computed: {
    displayModal: {
      get() {
        return this.display;
      },
      set(display) {
        this.$emit("toggle", display);
      }
    }
  }
};
</script>

<style>
</style>