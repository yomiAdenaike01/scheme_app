<template>
  <el-row class="todos_container">
    <h3>Todos</h3>
    <el-col> </el-col>
  </el-row>
</template>

<script>
import Form from "@/components/Form";
import UploadFile from "@/components/UploadFile";
import { mapState, mapGetters } from "vuex";
import TodoItem from "./TodoItem";
export default {
  name: "Todos",
  computed: {
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),
    /**
     * Content,
     *
     */
    createTodoConfig() {
      return [];
    }
  },
  components: {
    TodoItem
  }
};
</script>

<style lang="scss" scoped>
.todos_container {
  border: $border;
}
</style>
