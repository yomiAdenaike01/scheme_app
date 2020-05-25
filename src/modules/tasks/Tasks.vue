<template>
  <div class="task_boards_container">
    <slide-x-right-transition mode="out-in">
      <div v-if="!display" class="boards_wrapper">
        <div class="tasks_boards">
          <TaskBoard
            v-for="(board, boardIndex) in boards"
            :key="`${board._id}${boardIndex}`"
            :board-data="board"
            :board-index="boardIndex"
            @createTask="createTask"
            @viewTask="viewTask"
          />
          <template v-if="calcBoardsLeft > 0">
            <TaskBoard
              v-for="(board, index) in calcBoardsLeft"
              :key="index"
              :board-index="index"
              new-board
            />
          </template>
        </div>
      </div>

      <TaskView
        v-if="display"
        :task-information="task"
        :board-index="boardIndex"
        @toggle="
          task = {};
          display = false;
        "
      />
    </slide-x-right-transition>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import { SlideXRightTransition } from "vue2-transitions";

import TaskBoard from "./components/TaskBoard";
import TaskView from "./components/TaskView";

export default {
  name: "Tasks",
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
      task: {},
      filters: {
        name: "",
        date: ""
      }
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
.filters_container {
  display: flex;
  align-items: center;
  padding: 10px;
  justify-content: space-between;
}
.tasks_boards {
  display: flex;
  flex: 1;
}
.task_input_filter {
  padding: 15px;
  background: rgb(245, 245, 245);
  flex: 1;
  border-radius: 10px;
  border: none;
  outline: none;
  font-size: 1.1em;
  margin: 10px 0;
}
.task_boards_container {
  display: flex;
  flex: 1;
  padding: 10px;
}
.task_boards_wrapper {
  display: flex;
  flex: 1;
}
.boards_wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
