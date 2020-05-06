<template>
  <div
    v-loading="loading"
    class="task_container"
    :class="{
      disabled: !isassigned_to,
      completed: hasEntries(taskInformation) && currState == 'complete'
    }"
    @click="viewTaskController"
  >
    <div class="task_inner_container">
      <!-- Populated task -->
      <div class="populated_task_container">
        <div>
          <div class="header">
            <!-- Task item labels -->
            <h3>{{ taskInformation.name }}</h3>
          </div>
          <small class="grey">{{
            truncate(taskInformation.description, 100)
          }}</small>

          <div class="info_wrapper">
            <Comments mode="overview" :comment-count="comments.length" />
            <AssignedUsers
              class="user_wrapper"
              :users="taskInformation.assigned_to"
              @assignUser="assignToTask"
            />
            <el-tag v-if="taskInformation.dueDate">{{
              formatDate(taskInformation.dueDate)
            }}</el-tag>
          </div>
        </div>

        <transition name="el-fade-in">
          <div v-if="currState == 'complete'" class="completed_overlay">
            <el-button
              class="complete_button"
              circle
              icon="el-icon-check"
              type="success"
            />
            <el-button
              size="mini"
              type="text"
              @click="
                updateTask({
                  boardIndex,
                  taskIndex,
                  _id: taskInformation._id,
                  update: { state: 0 }
                })
              "
              >Undo complete</el-button
            >
          </div>
        </transition>
        <!-- Tag container (date,assigned to, duedate) -->
        <div class="tag_container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "TaskItem",
  components: {
    Form: () => import("@/components/Form"),
    Labels: () => import("./Labels"),
    AssignedUsers: () => import("./AssignedUsers"),
    Comments: () => import("./Comments")
  },
  props: {
    taskInformation: {
      type: Object,
      default: () => {}
    },
    taskIndex: {
      type: Number,
      default: 0
    },
    boardIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false,
      labelMode: "mini"
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin", "getTeamMember"]),
    comments() {
      return this.taskInformation?.comments ?? [];
    },

    labels() {
      return this.taskInformation?.labels ?? [];
    },
    currState() {
      return this.stateOptionsXref[this.taskInformation?.state]?.toLowerCase();
    },

    stateOptions() {
      let options = [];
      for (let i = 0, len = this.stateOptionsXref.length; i < len; i++) {
        let stateOption = this.stateOptionsXref[i];
        if (i != this.taskInformation.state) {
          options.push({
            value: i,
            label: stateOption
          });
        }
      }
      return options;
    },
    stateOptionsXref() {
      return ["Incomplete", "Complete", "Deferred"];
    },
    updateTaskStateConfig() {
      return [
        {
          "component-type": "select",
          options: this.stateOptions,
          placeholder: "Change task state",
          model: "state"
        }
      ];
    },
    buttonConfig() {
      let buttonConfig = {
        text: this.stateOptionsXref[this.taskInformation?.state]
      };

      switch (this.taskInformation?.state) {
        case 0: {
          (buttonConfig.round = true), (buttonConfig.type = "info");
          break;
        }

        case 2: {
          buttonConfig.round = true;
          buttonConfig.circle = false;
          buttonConfig.type = "warning";
          break;
        }

        default: {
          break;
        }
      }
      return buttonConfig;
    },
    isassigned_to() {
      return (
        this.taskInformation?.assigned_to?.indexOf(this.userInformation._id) >
          -1 || this.getIsAdmin
      );
    }
  },
  methods: {
    ...mapActions(["request"]),
    ...mapActions("Tasks", ["updateTask"]),
    viewTaskController() {
      if (this.currState != "complete") {
        this.$emit("viewTask", {
          boardIndex: this.boardIndex,
          taskIndex: this.taskIndex,
          ...this.taskInformation
        });
      }
    },
    assignToTask(e) {
      console.log(e);
    }
  }
};
</script>

<style lang="scss" scoped>
.task_container {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  text-overflow: ellipsis;
  position: relative;
  cursor: pointer;
  background: white;
  border-bottom: $border;
  transition: $default_transition;

  &:hover {
    box-shadow: $box_shadow;
  }
}
.labels {
  margin: 10px 0;
}
.task_inner_container {
  display: flex;
  flex-direction: column;
  flex: 1;
  border-radius: 10px;
  max-height: 300px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.populated_task_container {
  padding: 20px;
  flex: 1;
  position: relative;
  h3 {
    text-transform: capitalize;
    padding: 0;
    margin: 0;
  }
}
.completed_overlay {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(250, 250, 250, 0.9);
}
.complete_button {
  margin-bottom: 20px;
  pointer-events: none;
}
.mark_as_complete {
  border-radius: 50%;
}
.complete_indication {
  text-transform: capitalize;
  margin: 20px 0px;
}
.info_wrapper {
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid whitesmoke;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
