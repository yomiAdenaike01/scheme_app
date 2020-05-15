<template>
  <div class="tasks_sidebar">
    <div v-click-outside="onClickOutside" class="task_sidebar_container">
      <i class="bx bx-x grey" @click="view = false"></i>
      <div class="inner_container">
        <div class="inner_wrapper">
          <!-- Task actions -->
          <div class="button_container">
            <s-button
              v-if="canInteract"
              class="secondary rounded"
              icon="check"
              @click="handleUpdate({ state: 1 })"
              >Mark as complete</s-button
            >
            <s-button
              class=" shadow rounded primary tertiary"
              icon="x"
              @click="
                deleteTask(defaultPayload);
                view = false;
              "
              >Delete Task</s-button
            >
          </div>
          <!-- Labels, duedate, and assigned users -->
          <div class="information_wrapper">
            <div class="information_unit">
              <p>Assigned team members</p>
              <AssignedUsers
                remove-user
                add-new
                :users="taskInformation.assigned_to"
                @assignUser="handleUpdate"
                @removeUser="handleUpdate"
              />
            </div>
            <div class="information_unit">
              <p>Labels</p>
              <Labels
                mode="board"
                :icon-config="{
                  text: 'Create label',
                  actionStyle: 'squared'
                }"
                @createLabel="handleLabels.create.function"
                @updateLabel="handleLabels.update.function"
                @deleteLabel="handleLabels.delete.function"
              />
            </div>
            <div class="information_unit">
              <p>Due date</p>
              <div v-if="taskInformation.dueDate">
                <i class="bx bx-time"></i>
                {{ formatDate(taskInformation.dueDate) }}
              </div>
              <el-popover v-model="popoverDisplay.dueDate" trigger="click">
                <ActionIcon
                  slot="reference"
                  icon="time"
                  text="Set due date"
                  action-style="squared"
                />
                <Form
                  :config="dueDateConfig"
                  class="full_width"
                  @val="setDueDate"
                />
              </el-popover>
            </div>
          </div>
          <!-- Description container -->
          <div class="task_info_title">
            <i class="bx bx-align-left"></i>
            <span>Description</span>
          </div>
          <textarea
            v-model="description"
            :contenteditable="editDescription"
            class="task_textarea"
            :placeholder="taskInformation.description"
            @focus="handleDescriptions"
          ></textarea>
          <div class="button_container">
            <s-button v-if="description.length > 0" class="primary rounded"
              >Save</s-button
            >
          </div>

          <div class="task_info_title">
            <i class="bx bx-comment"></i>
            <span>Comments</span>
          </div>

          <Comments
            :can-interact="canInteract"
            mode="full"
            :comments="comments"
            @createComment="handleComments['create'].function($event)"
            @deleteComment="handleComments['delete'].function($event)"
            @scrollToBottom="scrollToBottom($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
import scrollToBottom from "@/mixins/scrollToBottom.js";
import vClickOutside from "v-click-outside";

export default {
  name: "TaskSidebar",
  components: {
    Avatar: () => import("@/components/Avatar"),
    Form: () => import("@/components/Form"),
    Labels: () => import("./Labels"),
    Comments: () => import("./Comments"),
    AssignedUsers: () => import("./AssignedUsers"),
    ActionIcon: () => import("@/components/ActionIcon"),
    SButton: () => import("@/components/SButton")
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  mixins: [scrollToBottom],

  props: {
    display: {
      type: Boolean,
      default: false
    },
    taskInformation: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      commentAction: "",
      editDescription: false,
      description: "",
      popoverDisplay: {
        dueDate: false
      }
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Tasks", ["boards", "commentRef"]),
    ...mapGetters(["getIsAdmin", "userLookup", "getGroupName"]),
    users() {
      return this.taskInformation.assigned_to.map(assignee => {
        return this.userLookup(assignee);
      });
    },
    defaultPayload() {
      let task = this.taskInformation;
      return {
        boardIndex: task.boardIndex,
        taskIndex: task.taskIndex,
        _id: task._id
      };
    },
    handleLabels() {
      let vm = this,
        url = "tasks/label",
        defaultPayload = this.defaultPayload;
      return {
        create: {
          method: "POST",
          url,
          function: function(labelData) {
            vm.CREATE_LABEL({
              _id: Math.random()
                .toString(16)
                .slice(2),
              ...labelData,
              ...defaultPayload
            });
            vm.request({
              url: this.url,
              method: this.method,
              data: { _id: defaultPayload._id, ...labelData }
            }).catch(() => {
              vm.REMOVE_LABEL();
            });
          }
        },
        update: {
          method: "PUT",
          url,
          function: function(labelData) {
            vm.UPDATE_LABEL({ ...labelData, ...defaultPayload });
            vm.request({
              method: this.method,
              url
            }).catch(() => {
              vm.REMOVE_LABEL();
            });
          }
        },
        delete: {
          method: "DELETE",
          url,
          function: function(labelData) {
            vm.REMOVE_LABEL(labelData.labelIndex);
            vm.request({
              method: this.method,
              url
            }).catch(() => {
              vm.CREATE_LABEL({ ...defaultPayload });
            });
          }
        }
      };
    },
    handleComments() {
      let vm = this,
        url = "tasks/comment",
        defaultPayload = this.defaultPayload;

      return {
        create: {
          method: "POST",
          url,
          function: function({ ref, message }) {
            vm.CREATE_COMMENT(
              Object.assign(defaultPayload, {
                data: {
                  message,
                  updated: false,
                  date_created: new Date().toISOString(),
                  task_id: defaultPayload._id,
                  assigned_to: {
                    name: vm.userInformation.name,
                    _id: vm.userInformation._id
                  }
                }
              })
            );

            vm.request({
              method: this.method,
              url: this.url,
              data: { message, task_id: defaultPayload._id }
            })
              .catch(() => {
                vm.DELETE_COMMENT();
              })
              .then(response => {
                response = {
                  ...response,
                  assigned_to: vm.userInformation
                };
                vm.UPDATE_COMMENT({ update: response, ...defaultPayload });
              });
            vm.scrollToBottom(ref);
          }
        },

        delete: {
          method: "DELETE",
          url,
          function: function({ commentIndex, _id }) {
            vm.DELETE_COMMENT({ commentIndex, ...defaultPayload });
            vm.request({
              method: this.method,
              url: this.url,
              data: { _id }
            });
          }
        }
      };
    },
    comments() {
      return this.taskInformation?.comments ?? [];
    },
    canInteract() {
      return (
        this.taskInformation.assigned_to.indexOf(this.userInformation._id) >
          -1 || this.getIsAdmin
      );
    },
    dueDateConfig() {
      return [
        {
          "component-type": "date-picker",
          "input-type": "date-time",
          model: "dueDate",
          placeholder: "Set due date"
        }
      ];
    },
    boardName() {
      return this.boards.find(board => {
        return board._id == this.taskInformation.boardID;
      })?.name;
    },

    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("toggle", false);
      }
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapActions("Tasks", ["deleteTask", "updateTask"]),
    ...mapMutations("Tasks", [
      "CREATE_COMMENT",
      "DELETE_COMMENT",
      "CREATE_LABEL",
      "UPDATE_LABEL",
      "REMOVE_LABEL",
      "UPDATE_COMMENT"
    ]),
    onClickOutside(e) {
      if (e.target.classList.value.includes("tasks_sidebar")) {
        this.view = false;
      }
    },
    setDueDate(e) {
      this.updateTask({ dueDate: e });
    },
    handleUpdate(update) {
      this.updateTask({ ...this.defaultPayload, update });
      this.view = false;
    },
    handleDescriptions() {
      // admin or assigned to
      if (this.taskInformation.created_by._id == this.userInformation._id) {
        this.editDescription = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tasks_sidebar {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 11;
}
.task_sidebar_container {
  background: white;
  box-shadow: $box_shadow;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 73%;
}
.button_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
}
.information_wrapper {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.information_unit {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  font-size: 0.8em;
  &/deep/ .labels_container {
    margin: 0;
  }
}

.task_textarea {
  width: 100%;
  background: rgb(250, 250, 250);
  min-height: 300px;
  max-height: 300px;
  overflow-x: hidden;
  flex: 1;
  padding: 10px;
  background: rgb(250, 250, 250);
  border-radius: 10px;
  outline: none;
  border: none;
}
.inner_wrapper {
  padding: 0 50px;
  height: 100%;
}
.information_wrapper {
  p {
    font-weight: 400;
    font-size: 1.2em;
    padding: 0;
    margin: 0 0 10px 0;
    color: grey;
  }
}
.inner_container {
  padding: 10px;
  height: 100%;
}
.task_info_title {
  margin: 20px 0;
  display: flex;
  color: #999;
  align-items: center;
  .bx {
    margin-right: 20px;
  }
}
</style>
