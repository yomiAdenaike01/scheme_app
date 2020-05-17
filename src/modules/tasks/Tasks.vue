<template>
  <div class="task_boards_container">
    <slide-x-right-transition mode="out-in">
      <div v-if="!display" class="boards_wrapper">
        <TaskBoard
          v-for="(board, boardIndex) in boards"
          :key="board._id"
          :board-data="board"
          @createTask="createTask"
          @viewTask="viewTask"
        />

        <TaskBoard
          v-for="(board, index) in calcBoardsLeft"
          :key="index"
          :board-index="index"
          new-board
        />
      </div>

      <TaskView
        v-else
        :task-information="task"
        :board-index="boardIndex"
        @toggle="
          task = {};
          display = false;
        "
        @viewNextTask="loadNextTask"
      />
    </slide-x-right-transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import TaskBoard from "./components/TaskBoard";
import TaskView from "./components/TaskView";
import { SlideXRightTransition } from "vue2-transitions";

export default {
  name: "TasksModule",
  components: {
    TaskBoard,
    TaskView,
    SlideXRightTransition
  },
  data() {
    return {
      display: false,
      routedTaskData: {},
      displayTask: false,
      boardIndex: 0,
      task: {}
    };
  },

  computed: {
    ...mapState(["clientInformation", "userInformation"]),
    ...mapState("Tasks", ["boards"]),

    boardCount() {
      return this.boards.length;
    },

    calcBoardsLeft() {
      return parseInt(this.clientInformation?.maxBoard ?? 5 - this.boardCount);
    }
  },
  activated() {
    if (this.$route.params?.user) {
      // Select a board
      // Force create task with auto assignement
    }
    if (this.$route.params?.task) {
      this.routedTaskData = this.$route.params.task;
      this.display = true;
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Tasks", ["CREATE_TASK"]),

    loadNextTask() {
      let { boardIndex, taskIndex } = this.task;
      // if last task in board go to next board if there is a next board
      let tasks = this.boards[boardIndex].tasks;
      let canLoadOnBoard = taskIndex + 1 > tasks.length;
      if (canLoadOnBoard) {
        this.task = tasks[taskIndex + 1];
      } else {
        // has next board
        if (this.boards[boardIndex + 1]) {
          this.task = this.boards[boardIndex + 1].tasks[0];
        }
      }
    },
    alterTask({ key, value }) {
      this.task[key] = value;
    },

    createTask({ boardIndex }) {
      this.boardIndex = boardIndex;
      this.display = true;
    },
    viewTask(task) {
      this.task = task;
      this.display = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.task_boards_container {
  display: flex;
  flex: 1;
}
.task_boards_wrapper {
  display: flex;
  flex: 1;
}
.boards_wrapper {
  display: flex;
  flex: 1;
}
</style>
