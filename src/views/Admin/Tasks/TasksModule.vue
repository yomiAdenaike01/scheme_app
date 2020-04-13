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
        @viewTask="viewTask"
      />
      <TaskBoard
        v-for="(board, index) in calcBoardsLeft"
        :key="index"
        :board-index="index"
        new-board
      />
    </div>
    <TaskDialog
      v-if="displayTask"
      :display="displayTask"
      :task-information="viewTaskInformation"
      @toggle="displayTask = $event"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "TasksModule",
  components: {
    TaskBoard: () => import("./components/TaskBoard"),
    CreateTask: () => import("./components/CreateTask"),
    TaskDialog: () => import("./components/TaskDialog")
  },
  data() {
    return {
      display: false,
      createTaskInformation: {},
      displayTask: false,
      viewTaskInformation: {}
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapState("Admin", ["boards"]),

    boardCount() {
      return this.boards.length;
    },

    calcBoardsLeft() {
      return parseInt(this.clientInformation?.maxBoard ?? 5 - this.boardCount);
    }
  },
  methods: {
    toggleCreateTask(e) {
      this.display = e.display;
      this.createTaskInformation = {
        boardData: e.boardData,
        boardIndex: e.boardIndex
      };
    },
    viewTask(task) {
      this.displayTask = true;
      this.viewTaskInformation = task;
    }
  }
};
</script>

<style lang="scss" scoped>
.task_boards_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 10px;
}
.boards_wrapper {
  display: flex;
  flex: 1;
}
</style>
