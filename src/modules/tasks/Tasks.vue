<template>
  <div class="task_boards_container">
    <TaskOverlay
      :create-task-information="createTaskInformation"
      :display="display"
      @toggleDisplay="display = $event"
    />
    <div class="boards_wrapper">
      <TaskBoard
        v-for="board in boards"
        :key="board._id"
        :board-data="board"
        @createTask="toggleTaskOverlay"
        @viewTask="viewTask"
      />

      <TaskBoard
        v-for="(board, index) in calcBoardsLeft"
        :key="index"
        :board-index="index"
        new-board
      />
    </div>
    <slide-x-right-transition>
      <TaskSidebar
        v-if="displayTask"
        :display="displayTask"
        :task-information="viewTaskInformation"
        @toggle="displayTask = $event"
      />
    </slide-x-right-transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import TaskBoard from "./components/TaskBoard";
import TaskSidebar from "./components/TaskSidebar";
import TaskOverlay from "./components/TaskOverlay";
import { SlideXRightTransition } from "vue2-transitions";

export default {
  name: "TasksModule",
  components: {
    TaskBoard,
    TaskSidebar,
    TaskOverlay,
    SlideXRightTransition
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
    ...mapState("Tasks", ["boards"]),

    boardCount() {
      return this.boards.length;
    },

    calcBoardsLeft() {
      return parseInt(this.clientInformation?.maxBoard ?? 5 - this.boardCount);
    }
  },
  methods: {
    toggleTaskOverlay(e) {
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
  flex: 1;
  padding: 10px;
}
.boards_wrapper {
  display: flex;
  flex: 1;
}
</style>
