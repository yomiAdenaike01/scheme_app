<template>
  <div class="task_boards_container">
    <CreateTask
      :create-task-information="createTaskInformation"
      :display="display"
      @toggleDisplay="display = $event"
    />
    <div class="boards_wrapper">
      <TaskBoard
        v-for="board in boards"
        :key="board._id"
        :board-data="board"
        @createTask="toggleCreateTask"
      />
      <TaskBoard
        v-for="(board, index) in calcBoardsLeft"
        :key="index"
        :board-index="index"
        new-board
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Tasks",
  components: {
    TaskBoard: () => import("./components/TaskBoard"),
    CreateTask: () => import("./components/CreateTask")
  },
  data() {
    return {
      display: false,
      createTaskInformation: {}
    };
  },
  computed: {
    ...mapState("Admin", ["boardsInformation"]),
    boards() {
      return this.boardsInformation ?? [];
    },
    calcBoardsLeft() {
      return this.clientInformation?.boardQuota ?? 5 - this.boards.length;
    }
  },
  methods: {
    toggleCreateTask(e) {
      this.display = e.display;
      this.createTaskInformation = e.boardData;
    }
  }
};
</script>

<style lang="scss" scoped>
.task_boards_container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.boards_wrapper {
  display: flex;
  flex: 1;
}
</style>
