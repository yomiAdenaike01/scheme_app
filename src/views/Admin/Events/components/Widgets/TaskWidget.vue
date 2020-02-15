<template>
  <el-row class="todos_container">
    <h3>Todos</h3>
    <el-col>{{ dueToday.length }}</el-col>

    <el-button
      type="primary"
      size="small"
      @click="$router.push({ name: 'utilities' })"
      >View Todos</el-button
    >
  </el-row>
</template>

<script>
import Form from "@/components/Form";
import UploadFile from "@/components/UploadFile";
import { mapState, mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "TaskWidget",
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["todos"]),

    ...mapGetters(["getIsAdmin"]),
    /**
     * Content,
     *
     */
    dueToday() {
      let now = moment();
      return this.todos.filter(todo => {
        let { dueDate } = todo;
        dueDate = moment(dueDate).isAfter(now);
        return dueDate;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.todos_container {
  border: $border;
  flex: 1;
}
</style>
