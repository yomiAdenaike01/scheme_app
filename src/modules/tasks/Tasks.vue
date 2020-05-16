<template>
  <div class="task_boards_container">
    <slide-x-right-transition mode="out-in">
      <div v-if="!display" class="boards_wrapper">
        <TaskBoard
          v-for="(board, boardIndex) in boards"
          :key="board._id"
          :board-data="board"
          @createTask="createTask(boardIndex)"
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
        :task="task"
        @dataChange="alterTask"
        @toggle="display = false"
        @viewNextTask="loadNextTask"
      />
    </slide-x-right-transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
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
      task: {},
      displayTask: false
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
  },
  methods: {
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

    createTask(boardIndex) {
      this.task = {
        _id: Math.random()
          .toString(16)
          .slice(2),
        boardIndex,
        name: "New Task",
        description: "",
        due_date: null,
        assigned_to: [this.userInformation],
        labels: [],
        comments: [],
        newTask: true
      };
      this.CREATE_TASK(this.task);
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
