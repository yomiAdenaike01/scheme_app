<template>
  <div
    v-loading="loading"
    class="task_container"
    :class="{
      disabled: !isAssignedTo,
      completed: hasEntries(taskInformation) && currState == 'complete'
    }"
  >
    <div class="task_inner_container">
      <!-- Populated task -->
      <div class="populated_task_container">
        <div>
          <div class="header">
            <h3>{{ taskInformation.title }}</h3>
            <!-- Popover for transfer to board -->
            <i
              slot="trigger"
              class=" trigger bx bx-dots-horizontal-rounded grey"
              @click="viewTaskController"
            ></i>
          </div>
          <small class="grey">{{ taskInformation.description }}</small>
          <el-tag v-if="taskInformation.dueDate">{{
            formatDate(taskInformation.dueDate)
          }}</el-tag>
        </div>
        <div
          v-if="taskInformation.assignedTo.indexOf(userInformation._id) == -1"
        >
          <el-tag
            v-for="teamMember in taskInformation.assignedTo"
            :key="teamMember"
            >{{ getUserInformation(teamMember) }}</el-tag
          >
        </div>
        <Popover trigger="click">
          <el-button
            v-if="currState != 'complete'"
            slot="trigger"
            class="complete_indication"
            round
            size="mini"
            v-bind="buttonConfig"
            >{{ buttonConfig.text }}</el-button
          >
          <Form
            slot="content"
            disable
            emit-on-change
            class="full_width"
            :config="updateTaskStateConfig"
            @change="updateTask"
          />
        </Popover>
        <transition name="el-fade-in">
          <div v-if="currState == 'complete'" class="completed_overlay">
            <el-button
              class="complete_button"
              circle
              icon="el-icon-check"
              type="success"
            />
            <el-button size="mini" type="text" @click="updateTask({ state: 0 })"
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
    Popover: () => import("@/components/Popover")
  },
  props: {
    taskInformation: {
      type: Object,
      default: () => {}
    },
    taskIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapGetters("Admin", ["getUserInformation"]),
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
    isAssignedTo() {
      return (
        this.taskInformation?.assignedTo?.indexOf(this.userInformation._id) >
          -1 || this.getIsAdmin
      );
    }
  },
  methods: {
    ...mapActions(["request"]),
    viewTaskController() {
      if (this.currState != "complete") {
        this.$emit("viewTask", this.taskInformation);
      }
    },
    updateTask(update) {
      return console.log(update);
      this.loading = true;
      this.request({
        method: "PUT",
        url: "tasks/update",
        data: { _id: this.taskInformation._id, update }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteTask() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "tasks/delete",
        data: { _id: this.taskInformation._id }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.task_container {
  display: flex;
  text-overflow: ellipsis;
  position: relative;

  background: white;
  box-shadow: 1px 2px 6px rgb(230, 230, 230);
  margin: 30px 0;
  border-radius: 10px;
  max-height: 200px;

  &.completed {
    border-left: 2px solid $success_colour;
  }
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
</style>
