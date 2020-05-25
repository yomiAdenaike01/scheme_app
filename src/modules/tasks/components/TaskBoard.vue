<template>
  <div class="board_container">
    <div v-if="!newBoard && boardData" class="inner_board_container">
      <div class="board_header">
        <!-- Update board name and description -->
        <div class="update_board_container">
          <div class="text_container">
            <input
              v-model="boardData.name"
              type="text"
              :placeholder="boardData.name"
              :disabled="!adminPermission"
              class="s_input capitalize no_border bold board_name_input"
            />
            <input
              v-model="boardData.description"
              type="text"
              :placeholder="boardData.description"
              class="s_input capitalize no_border board_name_input description"
              :disabled="!adminPermission"
            />
          </div>
        </div>
        <!-- Save changes  -->
        <i
          v-if="boardChanged"
          class="bx bx-down-arrow-circle grey trigger save_board"
          @click="updateBoard"
        ></i>
        <!-- Task progress -->
        <el-progress
          v-if="filteredTasks.length > 0"
          :status="progressCount.status"
          :percentage="progressCount.percentage"
        ></el-progress>
      </div>
      <!-- No tasks found -->
      <div v-if="filteredTasks.length == 0" class="text_container all_centre">
        <h3>No tasks found</h3>
        <p>Press the button below to create a task assigned to this board</p>
      </div>

      <slide-x-left-transition v-else group>
        <!-- Filters -->
        <div
          key="filters_container"
          v-click-outside="onClickOutside"
          class="filters_container"
        >
          <div
            class="navigation_container trigger
"
            @click="filters.display = !filters.display"
          >
            <small class="grey"><strong>Filters</strong></small>
            <i
              :class="`bx bx-${filters.display ? 'down' : 'right'}-arrow-alt`"
            ></i>
          </div>
          <collapse-transition>
            <div v-if="filters.display" class="input_wrapper">
              <input
                v-model="filters.name"
                class="s_input"
                placeholder="Task name"
                type="text"
              />
              <input
                v-model="filters.assigned_to"
                placeholder="Task assigned to"
                type="text"
                class="s_input"
              />
            </div>
          </collapse-transition>
        </div>
        <!-- Tasks -->
        <TaskItem
          v-for="(task, index) in filteredTasks"
          :key="`${task._id}${index}`"
          class="task_item_placeholder"
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
          v-if="boardIndex == 0 && adminPermission"
          v-model="displayNewBoardForm"
          position="top"
          trigger="click"
          popper-class="popover_form"
        >
          <div slot="reference">
            <s-button class="only_icon secondary" icon="plus" />
          </div>
          <Form
            v-model="createBoardData"
            class="full_width"
            :validations="['name', 'description']"
            :submit-button="{
              class: 'mini bordered rounded',
              text: 'Create board'
            }"
            :config="formConfig"
            @val="createBoard"
          />
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import { SlideXLeftTransition, CollapseTransition } from "vue2-transitions";
import vClickOutside from "v-click-outside";

import TaskItem from "./TaskItem";
import SButton from "@/components/SButton";
import Form from "@/components/Form";
import genID from "@/mixins/genID";

export default {
  name: "TaskBoard",
  components: {
    TaskItem,
    SlideXLeftTransition,
    CollapseTransition,
    SButton,
    Form
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  mixins: [genID],
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
      taskCap: 10,
      displayEditBoard: false,
      filters: {
        display: false,
        name: "",
        assignedTo: ""
      },
      boardChanged: false,
      createBoardData: {},
      displayNewBoardForm: false
    };
  },
  computed: {
    ...mapState(["clientInformation"]),
    ...mapGetters(["adminPermission"]),
    filteredTasks() {
      let tasks = this.tasks,
        filters = this.filters,
        filteredTasks = [];
      for (let i = 0, len = tasks.length; i < len; i++) {
        let task = tasks[i];

        if (!task.name.toLowerCase().includes(filters.name.toLowerCase())) {
          continue;
        }

        let hasAssignedUser = task.assigned_to.some(member => {
          return member.name
            .toLowerCase()
            .includes(filters.assignedTo.toLowerCase());
        });

        if (!hasAssignedUser) {
          continue;
        }

        filteredTasks.push(task);
      }

      return filteredTasks.length > 0 ? filteredTasks : tasks;
    },

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
      if (index == 0 && this.adminPermission) {
        displayText.heading = heading;
        displayText.content = "Press the button above to initialse this board";
      }
      if (!this.adminPermission && index == 0) {
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
          component_type: "text",
          noLabel: true,
          placeholder: "Board name",
          model: "name",
          label: "Name"
        },
        {
          component_type: "text",
          textarea: true,
          noLabel: true,

          placeholder: "Board desciprtion",
          model: "description",
          label: "Description"
        }
      ];
    }
  },
  methods: {
    ...mapActions(["request", "genPromptBox"]),
    ...mapMutations(["UPDATE_CLIENT_INFORMATION"]),
    ...mapMutations("Tasks", [
      "UPDATE_BOARDS",
      "UPDATE_BOARD",
      "RESTORE_BOARD",
      "CREATE_TASK",
      "DELETE_BOARD"
    ]),
    onClickOutside() {
      if (this.filters.display) {
        this.filters.display = false;
      }
    },
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
          data: { _id: payload.board_id }
        }).catch(() => {
          this.UPDATE_BOARDS({ data: payload, action: "create" });
          this.DELETE_BOARD(payload.board_id);
          this.updateBoardQuota("minus");
        });
      });
    },
    createBoard() {
      let localBoardStub = Object.assign(this.createBoardData, {
        _id: this.genID(),
        date_created: new Date().toISOString()
      });
      this.UPDATE_BOARDS({ data: localBoardStub, action: "create" });
      this.updateBoardQuota("minus");

      let apiPayload = {
        data: this.createBoardData,
        method: "POST",
        url: "tasks/boards/create"
      };

      this.request(apiPayload).catch(() => {
        this.DELETE_BOARD(apiPayload.board_id);
        this.updateBoardQuota("plus");
      });
      this.displayNewBoardForm = false;
    },

    updateBoard() {
      // Only extract the changes
      let update = {
        name: this.boardData.name,
        desciprtion: this.boardData.description
      };
      this.UPDATE_BOARD({
        index: this.boardIndex,
        update
      });
      let payload = {
        data: update,
        method: "PUT",
        url: "tasks/boards/update"
      };

      this.request(payload).catch(() => {
        this.RESTORE_BOARD();
      });
      this.boardChanged = false;
    },
    createTask() {
      this.$emit("createTask", {
        boardIndex: this.boardIndex,
        taskIndex: this.boardData.tasks.length + 1
      });
    }
  },
  watch: {
    "boardData.name"(oldVal, newVal) {
      if (!this.boardChanged && oldVal != newVal) {
        this.boardChanged = true;
      }
    },
    "boardData.description"(oldVal, newVal) {
      if (!this.boardChanged && oldVal != newVal) {
        this.boardChanged = true;
      }
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
  padding: 10px;
  align-items: center;
  justify-content: space-between;
  text-transform: capitalize;
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
.board_name_input {
  font-size: 1.3em;
  padding: 0;
  margin: 0;
  &.description {
    font-size: initial;
  }
}
.new_board_container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
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

.filters_container {
  display: flex;
  flex-direction: column;

  .navigation_container {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: $border;
  }
  .input_wrapper {
    padding: 10px;
  }
  .s_input {
    margin-top: 10px;
  }
}
.save_board {
  font-size: 1.8em;
}
</style>
