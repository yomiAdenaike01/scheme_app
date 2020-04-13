<template>
  <div class="board_container">
    <div v-if="!newBoard && boardData" class="inner_board_container">
      <div class="board_header">
        <div class="update_board_container">
          <div class="text_container">
            <h2>{{ boardData.name }}</h2>
            <span>{{ truncate(description) }}</span>
          </div>

          <el-popover trigger="click" position="right">
            <i
              slot="reference"
              class="trigger bx bx-dots-horizontal-rounded grey"
            ></i>
            <div class="content">
              <Form
                class="full_width"
                :config="formConfig"
                :submit-button="{ text: 'Update board' }"
                @val="updateAction"
              />
              <el-divider></el-divider>

              <el-button
                type="danger"
                class="long"
                size="mini"
                plain
                @click="deleteAction"
                >Delete Board</el-button
              >
            </div>
          </el-popover>
        </div>
        <el-progress
          v-if="tasks.length > 0"
          :status="progressCount.status"
          :percentage="progressCount.percentage"
        ></el-progress>
      </div>
      <div v-if="!tasks.length > 0" class="no_tasks_container">
        <InformationDisplay
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
      </div>
      <TaskItem
        v-for="(task, index) in boardData.tasks"
        :key="`${task._id}${index}`"
        :task-information="task"
        :task-index="index"
        :board-index="boardIndex"
        @viewTask="$emit('viewTask', $event)"
      />
      <div
        class="create_new_task_wrapper grey"
        @click="$emit('createTask', { boardData, boardIndex, display: true })"
      >
        <span> <i class="bx bx-plus"></i> Create new task</span>
      </div>
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
        <el-popover
          v-if="boardIndex == 0 && getIsAdmin"
          slot="header"
          position="top"
          trigger="click"
        >
          <el-button
            slot="reference"
            type="text"
            icon="el-icon-plus"
          ></el-button>
          <Form class="full_width" :config="formConfig" @val="createAction" />
        </el-popover>
      </InformationDisplay>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "TaskBoard",
  components: {
    Form: () => import("@/components/Form"),
    InformationDisplay: () => import("@/components/InformationDisplay"),
    TaskItem: () => import("./TaskItem")
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
      taskCap: 10
    };
  },
  computed: {
    ...mapGetters(["getIsAdmin"]),
    description() {
      return this.boardData?.description ?? "";
    },
    tasks() {
      return this.boardData?.tasks ?? [];
    },
    progressCount() {
      let percentage = 0,
        status = "warning";
      if (this.tasks.length > 0) {
        let completedCount = this.tasks.filter(task => {
          return task.state == 1;
        }).length;
        (percentage = Math.round((completedCount / this.tasks.length) * 100)),
          (status = "");
      }

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

    computeText() {
      let index = this.boardIndex;
      let displayText = {
        heading: "Board is disabled",
        content: "Initialise the board before to enable this board."
      };
      if (index == 0 && this.getIsAdmin) {
        displayText.heading = "Initialise Board";
        displayText.content = "Press the button above to initialse this board";
      }
      if (!this.getIsAdmin && index == 0) {
        displayText.heading = "Initialise Board";
        displayText.content =
          "Only system administrators can initialise a task board";
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
    ...mapActions("Admin", [
      "getBoards",
      "createBoard",
      "updateBoard",
      "deleteBoard"
    ]),
    ...mapActions(["request", "genPromptBox"]),
    deleteAction() {
      this.deleteBoard({
        boardIndex: this.boardIndex,
        boardID: this.boardData._id
      });
    },
    createAction({ name, description }) {
      this.createBoard({
        name,
        description,
        _id: Math.random()
          .toString(16)
          .slice(2)
      });
    },
    updateAction({ name, description }) {
      this.updateBoard({ boardID: this.boardData._id, name, description });
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
  margin: 0 10px;
  border-radius: 5px;
  border: 2px solid whitesmoke;
  height: 100%;
  background: white;
}
.inner_board_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
  height: 90%;
  overflow-x: hidden;
}
.board_header {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  text-transform: capitalize;
  padding-bottom: 20px;
  border-bottom: 2px solid whitesmoke;
  h1,
  h2,
  h3 {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  span {
    color: #999;
  }
  .text_container {
    display: flex;
    flex-direction: column;
  }
  .update_board_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
.progress_alt {
  margin: 10px 0;
  text-transform: initial;
}
.no_tasks_container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.create_new_task_wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;

  cursor: pointer;
  background: rgb(252, 252, 252);
  span {
    transition: $default_transition;
  }
  &:hover span {
    transform: translateY(-10px);
  }
}
</style>
