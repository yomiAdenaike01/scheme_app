<template>
  <el-dialog :visible.sync="view">
    <Title
      title="Create Employee"
      subtitle="Fill in the form below to create an employee, the employee will recieve an email for them to finalize their account details."
      slot="title"
    />
    <el-form> </el-form>
  </el-dialog>
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
  },
  components: {
    Title: () => import('@/components/Title')
  }
}
</script>

<style></style>
