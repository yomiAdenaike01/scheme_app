<template>
  <el-dialog :visible.sync="view" width="200">
    <div class="inner_container">
      <div class="task_info_title">
        <div class="inner_wrapper">
          <!-- Labels, duedate, and assigned users -->
          <div class="information_wrapper">
            <div class="information_unit">
              <p>Assigned team members</p>
              <AssignedUsers :users="users" />
            </div>
            <div class="information_unit">
              <p>Labels</p>
              <Labels
                mode="board"
                :icon-config="{
                  text: 'Create label',
                  actionStyle: 'squared'
                }"
              />
            </div>
            <div class="information_unit">
              <p>Due date</p>
              <div v-if="taskInformation.dueDate">
                <i class="bx bx-time"></i>
                {{ taskInformation.dueDate }}
              </div>
              <el-popover trigger="click">
                <ActionIcon
                  slot="reference"
                  icon="time"
                  text="Set due date"
                  action-style="squared"
                />
                <Form :config="dueDateConfig" @val="setDueDate" />
              </el-popover>
            </div>
          </div>
          <!-- Description container -->
          <div class="description_container">
            <div class="task_info_title">
              <i class="bx bx-align-left"></i>
              <span>Description</span>
            </div>
            <p>{{ taskInformation.description }}</p>
          </div>
          <Comments
            :can-interact="canInteract"
            mode="full"
            :comments="comments"
          />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "TaskDrawer",
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
          "input-type": "date",
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
    setDueDate(e) {
      this.updateTask({ dueDate: e });
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
