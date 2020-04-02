<template>
  <div v-loading="loading" class="board_container">
    <div v-if="!newBoard && boardData" class="inner_board_container">
      <div class="board_header">
        <h2>{{ boardData.name }}</h2>
        <span>{{ boardData.description }}</span>
        <el-progress
          :status="progressCount.status"
          :percentage="progressCount.percentage"
        ></el-progress>
      </div>
      <InformationDisplay
        v-if="!hasTasks"
        :display-text="{
          hasIcon: true,
          heading: 'No tasks found',
          content:
            'Press the button below to create a task assigned to this board'
        }"
      >
        <i slot="heading" class="bx bx-task"></i>
        <el-button circle icon="el-icon-plus" @click="createTask" />
      </InformationDisplay>
      <TaskItem
        v-for="(task, index) in boardData.tasks"
        :key="task._id"
        :task-information="task"
        :task-index="index"
      />
      <TaskItem
        is-new
        @createTask="$emit('createTask', { boardData, display: true })"
      />
    </div>
    <div
      v-else
      class="new_board_container"
      :class="{ disabled: boardIndex != 0 }"
    >
      <InformationDisplay
        class="info_display"
        :display-text="{
          hasIcon: true,
          ...computeText
        }"
      >
        <Popover
          v-if="boardIndex == 0"
          slot="header"
          position="top"
          trigger="click"
        >
          <el-button slot="trigger" type="text" icon="el-icon-plus"></el-button>
          <Form
            slot="content"
            class="full_width"
            :config="formConfig"
            @val="createBoard"
          />
        </Popover>
      </InformationDisplay>
    </div>
  </div>
</template>

<script>
import Popover from "@/components/Popover";
import { mapActions } from "vuex";
export default {
  name: "TaskBoard",
  components: {
    Form: () => import("@/components/Form"),
    InformationDisplay: () => import("@/components/InformationDisplay"),
    TaskItem: () => import("./TaskItem"),
    Popover
  },
  props: {
    newBoard: {
      type: Boolean,
      default: false
    },
    boardIndex: {
      type: Number,
      default: 0
    },
    boardData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      taskCap: 10
    };
  },
  computed: {
    progressCount() {
      let tasksTotal = this.boardData?.tasks?.length ?? 0,
        completedCount = this.boardData.tasks.filter(task => {
          return task.state == 1;
        }).length,
        percentage = Math.round((completedCount / tasksTotal) * 100),
        status = "";

      if (percentage > 50) {
        status = "success";
      } else if (percentage < 50) {
        status = "warning";
      }
      return {
        percentage,
        status
      };
    },
    calcBlankTasks() {
      return this.boardData?.tasks.length + 1 < 10;
    },
    hasTasks() {
      return this.boardData.tasks.length > 0;
    },
    computeText() {
      let index = this.boardIndex;
      let displayText = {
        heading: "Board is disabled",
        content: "Initialise the board before to enable this board."
      };
      if (index == 0) {
        displayText.heading = "Initialise Board";
        displayText.content = "Press the button above to initialse this board";
      }
      return displayText;
    },
    formConfig() {
      return [
        {
          "component-type": "text",
          placeholder: "Board name",
          model: "name"
        },
        {
          "component-type": "text",
          textarea: true,
          placeholder: "Board desciprtion",
          model: "description"
        }
      ];
    }
  },
  methods: {
    ...mapActions("Admin", ["getBoards"]),
    ...mapActions(["request"]),
    deleteBoard() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "tasks/boards/delete",
        data: { _id: this.boardID }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    createBoard({ name, description }) {
      this.loading = true;
      this.request({
        method: "POST",
        url: "tasks/boards/create",
        data: { name, description }
      })
        .then(() => {
          this.loading = false;
          this.getBoards();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    createTask() {
      this.UPDATE_DIALOG_INDEX({
        dialog: "task",
        view: true,
        data: this.boardID
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.board_container {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin: 10px;
  border-radius: 12px;
  border: 2px solid whitesmoke;
  overflow-x: hidden;
}
.inner_board_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}
.board_header {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  text-transform: capitalize;
  h1,
  h2,
  h3 {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  span {
    color: #999;
  }
}
.new_board_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.info_display {
  &/deep/ .heading {
    font-weight: bold;
  }
}
.popover_form {
  &/deep/ .el-form-item__content,
  .dialog_item {
    width: 100%;
  }
}
</style>
