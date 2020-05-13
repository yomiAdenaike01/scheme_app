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
                :heading="heading"
                :config="formConfig"
                :submit-button="{ text: 'Update board' }"
                @val="updateBoard"
              />
              <hr />

              <s-button class="rounded tertiary shadow" icon="x"
                >Delete Board</s-button
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
      <div v-if="tasks.length == 0" class="text_container all_centre">
        <h3>No tasks found</h3>
        <p>Press the button below to create a task assigned to this board</p>
      </div>
      <slide-x-left-transition v-else group>
        <TaskItem
          v-for="(task, index) in boardData.tasks"
          :key="`${task._id}${index}`"
          :task-information="task"
          :task-index="index"
          :board-index="boardIndex"
          @viewTask="$emit('viewTask', $event)"
        />
      </slide-x-left-transition>

      <div class="create_new_item grey" @click="createTask">
        <span> <i class="bx bx-plus"></i> Create new task</span>
      </div>
    </div>
    <div
      v-else
      class="new_board_container"
      :class="{ disabled: boardIndex != 0 }"
    >
      <div class="text_container all_centre">
        <h3>{{ computeText.heading }}</h3>
        <p>{{ computeText.content }}</p>

        <el-popover
          v-if="boardIndex == 0 && getIsAdmin"
          position="top"
          trigger="click"
        >
          <div slot="reference">
            <s-button class="only_icon secondary" icon="plus" />
          </div>
          <Form class="full_width" :config="formConfig" @val="createBoard" />
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { SlideXLeftTransition } from "vue2-transitions";
import TaskItem from "./TaskItem";
import SButton from "@/components/SButton";
import Form from "@/components/Form";

export default {
  name: "TaskBoard",
  components: {
    TaskItem,
    SlideXLeftTransition,
    SButton,
    Form
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
    ...mapState(["clientInformation"]),
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
        heading: "Task board is disabled",
        content: "Initialise the board before to enable this board."
      };
      let heading = "Create task board";
      if (index == 0 && this.getIsAdmin) {
        displayText.heading = heading;
        displayText.content = "Press the button above to initialse this board";
      }
      if (!this.getIsAdmin && index == 0) {
        displayText.heading = heading;
        displayText.content =
          "Only system administrators can create a task board";
      }
      return displayText;
    },
    heading() {
      return {
        name: "<h3>Board information</h3>"
      };
    },
    formConfig() {
      return [
        {
          "component-type": "text",
          noLabel: true,
          placeholder: "Board name",
          model: "name"
        },
        {
          "component-type": "text",
          textarea: true,
          noLabel: true,

          placeholder: "Board desciprtion",
          model: "description"
        }
      ];
    }
  },
  methods: {
    ...mapActions(["request", "genPromptBox"]),
    ...mapMutations(["UPDATE_CLIENT_INFORMATION"]),
    ...mapMutations("Tasks", [
      "UPDATE_BOARDS",
      "RESTORE_BOARD",
      "CREATE_TASK",
      "DELETE_BOARD"
    ]),
    updateBoardQuota(action = "minus") {
      let value = this.clientInformation.board_quota + 1;
      if (action == "minus") {
        value = value - 1;
      } else {
        value = value + 1;
      }
      this.UPDATE_CLIENT_INFORMATION({ board_quota: value });
    },
    deleteBoard(payload) {
      this.genPromptBox({
        boxType: "confirm",
        text: "Are you sure you want to delete this board ?",
        title: "Delete Board"
      }).then(() => {
        this.DELETE_BOARD(payload.boardIndex);
        this.updateBoardQuota("plus");
        this.request({
          method: "DELETE",
          url: "tasks/boards/delete",
          data: { _id: payload.boardID }
        }).catch(() => {
          this.UPDATE_BOARDS({ data: payload, action: "create" });
          this.DELETE_BOARD(payload.boardID);
          this.updateBoardQuota("minus");
        });
      });
    },
    createBoard(payload) {
      this.UPDATE_BOARDS({ data: payload, action: "create" });
      this.updateBoardQuota("minus");
      let { _id, ...data } = payload;

      payload = {
        data,
        method: "POST",
        url: "tasks/boards/create"
      };

      this.request(payload).catch(() => {
        this.DELETE_BOARD(payload.boardID);
        this.updateBoardQuota("plus");
      });
    },

    updateBoard(payload) {
      this.UPDATE_BOARDS({ action: "update", ...payload });
      payload = {
        data: { ...payload },
        method: "PUT",
        url: "tasks/boards/update"
      };

      this.request(payload).catch(() => {
        this.RESTORE_BOARD();
      });
    },
    createTask() {
      this.$emit("createTask", {
        boardData: this.boardData,
        boardIndex: this.boardIndex,
        display: true
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
  border-radius: 16px;
  border: $border;
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
  border-bottom: $border;
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

.el-popover_form {
  &/deep/ .el-form-item__content,
  .dialog_item {
    width: 100%;
  }
}
.progress_alt {
  margin: 10px 0;
  text-transform: initial;
}

.create_new_item {
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
.references_wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background: darken(#99b898, 10);
  color: white;
  cursor: pointer;
  &:hover {
    background: darken(#99b898, 14);
  }
}
</style>
