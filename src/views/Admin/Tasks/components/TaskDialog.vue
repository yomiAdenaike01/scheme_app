<template>
  <el-dialog :visible.sync="view" width="200">
    <div class="inner_container">
      <div class="task_info_title">
        <div class="inner_wrapper">
          <!-- Labels, duedate, and assigned users -->
          <div class="information_wrapper">
            <div class="information_unit">
              <p>Assigned team members</p>
              <AssignedUsers :users="taskInformation.assignedTo" />
            </div>
            <div class="information_unit">
              <p>Labels</p>
              <Labels
                mode="board"
                :icon-config="{
                  text: 'Create label',
                  actionStyle: 'squared'
                }"
                @createLabel="handleLabels['create'].function($event)"
                @updateLabel="handleLabels['update'].function($event)"
                @deleteLabel="handleLabels['delete'].function($event)"
              />
            </div>
            <div class="information_unit">
              <p>Due date</p>
              <div v-if="taskInformation.dueDate">
                <i class="bx bx-time"></i>
                {{ taskInformation.dueDate }}
              </div>
              <el-popover v-model="popoverDisplay.dueDate" trigger="click">
                <ActionIcon
                  slot="reference"
                  icon="time"
                  text="Set due date"
                  action-style="squared"
                />
                <Form :config="dueDateConfig" @val="setDueDate" />
              </el-popover>
            </div>
            <div class="information_unit">
              <p>Assign to event</p>
            </div>
          </div>
          <!-- Description container -->
          <div class="description_container">
            <div class="task_info_title">
              <i class="bx bx-align-left"></i>
              <span>Description</span>
            </div>
            <p v-if="editDescription == false" @click="handleDescriptions">
              {{ taskInformation.description }}
            </p>
            <el-input
              v-if="editDescription"
              v-model="description"
              type="textarea"
              :placeholder="taskInformation.description"
            ></el-input>
            <el-button
              v-if="description.length > 0"
              type="text"
              @click="updateTask"
              >Save</el-button
            >
            <el-button
              v-if="editDescription"
              size="mini"
              type="text"
              @click="
                editDescription = false;
                description = '';
              "
              >Cancel</el-button
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
            @updateComment="handleComments['update'].function($event)"
            @deleteComment="handleComments['delete'].function($event)"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from "vuex";
export default {
  name: "TaskDialog",
  components: {
    Avatar: () => import("@/components/Avatar"),
    Form: () => import("@/components/Form"),
    Labels: () => import("./Labels"),
    Comments: () => import("./Comments"),
    AssignedUsers: () => import("./AssignedUsers"),
    ActionIcon: () => import("@/components/ActionIcon")
  },
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
    ...mapState("Admin", ["boards"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getUserInformation", "getGroupName"]),
    users() {
      return this.taskInformation.assignedTo.map(assignee => {
        return this.getUserInformation(assignee);
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
          function: function(message) {
            vm.CREATE_COMMENT(
              Object.assign(
                {
                  data: {
                    message,
                    updated: false,
                    dateCreated: new Date().toISOString(),
                    taskID: defaultPayload._id,
                    assignedTo: vm.userInformation._id
                  }
                },
                defaultPayload
              )
            );
            vm.request({
              method: this.method,
              url: this.url,
              data: { message, taskID: defaultPayload._id }
            }).catch(() => {
              vm.REMOVE_COMMENT();
            });
          }
        },
        update: {
          method: "PUT",
          url,
          function: function({ _id, message, commentIndex }) {
            let payload = Object.assign(
              { commentIndex, data: message, _id },
              defaultPayload
            );
            vm.UPDATE_COMMENT(payload);
            vm.request({
              method: this.method,
              url: this.url,
              data: { message, _id }
            }).catch(() => {
              vm.RESTORE_COMMENT();
            });
          }
        },
        delete: {
          method: "DELETE",
          url,
          function: function({ commentIndex, _id }) {
            vm.REMOVE_COMMENT(Object.assign({ commentIndex }, defaultPayload));
            vm.request({
              method: this.method,
              url: this.url,
              data: { _id }
            }).catch(() => {
              vm.RESTORE_COMMENT();
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
        this.taskInformation.assignedTo.indexOf(this.userInformation._id) >
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
    ...mapMutations("Admin", [
      "CREATE_COMMENT",
      "UPDATE_COMMENT",
      "REMOVE_COMMENT",
      "CREATE_LABEL",
      "UPDATE_LABEL",
      "REMOVE_LABEL"
    ]),
    setDueDate(e) {
      this.updateTask({ dueDate: e });
    },
    handleDescriptions() {
      // admin or assigned to
      if (this.taskInformation.createdBy._id == this.userInformation._id) {
        this.editDescription = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
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
}
.task_info_title {
  margin: 20px 0;
  span,
  .bx {
    font-weight: 400;
    color: #999;
  }
  span {
    margin-left: 10px;
  }
}
.inner_wrapper {
  padding: 0 50px;
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
}
</style>
