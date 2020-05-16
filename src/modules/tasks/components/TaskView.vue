<template>
  <div class="task_view_container">
    <!-- Task header -->
    <div class="task_view_bar">
      <div class="arrow_container left" @click="goBack">
        <i class="bx bx-left-arrow-alt grey"></i>
      </div>
      <div class="text_container">
        <h1 class="task_title">
          {{ task.name }}
        </h1>
        <h4 class="grey">{{ boardData.name }}</h4>
      </div>
      <div class="arrow_container right" @click="viewNextTask">
        <i class="bx bx-right-arrow-alt grey"></i>
      </div>
    </div>
    <!-- Task content -->
    <div class="task_content_body">
      <div class="task_main_content_wrapper">
        <h3 class="task_title_unit grey">Task description</h3>
        <textarea
          v-if="edit.description"
          class="task_description"
          :placeholder="task.description"
          :disabled="!hasAccess"
        ></textarea>
        {{ task.description }}
        {{ task }}
      </div>
      <!-- Task sidebar -->
      <div class="task_sidebar_content_wrapper">
        <!-- Add items -->
        <div class="add_items_container">
          <div
            v-for="(item, index) in addItems"
            :key="index"
            class="add_item"
            @click="toggleSelectedItem(item)"
          >
            <div class="header grey" :class="item.class">
              <div class="container">
                <i :class="item.icon"></i>
                <p>{{ makePretty(item.label) }}</p>
              </div>
              <i
                v-if="!item.hasOwnProperty('function')"
                :class="[
                  `bx bx-${
                    selectedItem == item.label ? 'down' : 'right'
                  }-arrow-alt grey`
                ]"
              ></i>
            </div>

            <collapse-transition>
              <!-- Members -->

              <div
                v-if="checkDrawer(item.label, 'members')"
                class="add_item_body"
              >
                <div
                  v-for="member in team"
                  :key="member._id"
                  :class="[
                    'team_member',
                    { disabled: task.assigned_to.indexOf(member) > -1 }
                  ]"
                  @click="toggleAssignedTeamMember(member._id)"
                >
                  <p>{{ member.name }}</p>
                  <i
                    v-if="task.assigned_to.indexOf(member._id) > -1"
                    class="bx bx-check"
                  />
                </div>
              </div>

              <!-- Labels -->

              <div
                v-if="checkDrawer(item.label, 'labels')"
                class="add_item_body"
              >
                <p>{{ item.label || item.text }}</p>
              </div>

              <!-- Deadlines -->

              <div
                v-if="checkDrawer(item.label, 'deadlines')"
                class="add_item_body"
              >
                <!-- Current deadline -->
                <p>{{ item.label }}</p>
                <!-- update deadline -->
              </div>
            </collapse-transition>
          </div>
        </div>

        <!-- Comments -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import SButton from "@/components/SButton";
import Comments from "./Comments";
import { CollapseTransition } from "vue2-transitions";
export default {
  name: "TaskView",
  components: {
    SButton,
    Comments,
    CollapseTransition
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      edit: {},
      selectedItem: ""
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Team", ["team"]),
    ...mapState("Tasks", ["boards"]),
    isNewTask() {
      return this.task?.newTask ?? false;
    },

    ...mapGetters(["adminPermission"]),
    addItems() {
      let quickActions = [
        {
          label: "members",
          icon: "bx bx-user-plus"
        },
        {
          label: "labels",
          icon: "bx bx-purchase-tag"
        },
        {
          label: "deadlines",
          icon: "bx bx-alarm-exclamation"
        },
        {
          label: "delete_task",
          icon: "bx bx-trash",
          class: "delete_task",
          function: () => {
            this.DELETE_TASK(this.indexs);
            this.$emit("toggle");
          }
        }
      ];
      if (this.isNewTask) {
        quickActions.push({
          label: "Save",
          class: "save_task",
          icon: "bx bx-download",
          function: () => {
            this.saveTask();
          }
        });
      }
      return quickActions;
    },
    edittableProperties() {
      return ["name", "description"];
    },
    boardData() {
      return this.boards[this.indexs.boardIndex];
    },
    isAssignedToUser() {
      return this.task.assigned_to.some(user => {
        return user?._id == this.userInformation._id;
      });
    },
    hasAccess() {
      return this.adminPermission || this.isAssignedToUser;
    },
    indexs() {
      return {
        taskIndex: this.task.taskIndex,
        boardIndex: this.task.boardIndex
      };
    },
    taskData: {
      get() {
        return this.task;
      },
      set(data) {
        console.log(data);
        this.$emit("dataChange", data);
        // this.$emit("dataChange", data);
      }
    }
  },
  created() {
    for (let i = 0, len = this.edittableProperties.length; i < len; i++) {
      let property = this.edittableProperties[i];
      this.edit[property] = false;
    }
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Tasks", [
      "DELETE_TASK",
      "CREATE_COMMENT",
      "DELETE_COMMENT"
    ]),

    toggleSelectedItem(item) {
      console.log(item);
      let { label } = item;
      if (!item?.function) {
        if (this.selectedItem == label) {
          this.selectedItem = "";
        } else {
          this.selectedItem = label;
        }
      } else {
        item.function();
      }
    },
    toggleAssignedTeamMember(teamMember) {
      let alreadyAssigned = this.task.assigned_to.indexOf(teamMember) > -1;

      // If already assigned remove them

      // Else add them
    },
    async saveTask() {
      // Send request
      // replace the task when response is good
    },
    goBack() {
      if (this.isNewTask) {
        this.DELETE_TASK(this.indexs);
      }
      this.$emit("toggle");
    },
    viewNextTask() {
      this.$emit("nextTask");
    },
    checkDrawer(label, match) {
      return (
        label.toLowerCase() == match && this.selectedItem.toLowerCase() == match
      );
    },
    async createComment({ commentIndex, message }) {
      try {
        this.CREATE_COMMENT({
          ...this.indexs,
          commentIndex,
          data: message
        });
        await this.request({
          method: "POST",
          url: "tasks/comments",
          data: {
            task_id: this.task._id,
            message
          }
        });
      } catch (error) {
        this.DELETE_COMMENT({
          ...this.indexs,
          commentIndex
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$quick_actions: (
  save_task: var(--green),
  delete_task: var(--danger)
);

.task_view_container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.task_view_bar {
  display: flex;
  justify-content: space-between;
  border-bottom: $border;
  background: white;
}
.text_container {
  margin: 0 0 0 40px;
  padding: 20px 0;
}
.task_title {
  padding: 10px 0;
}
.arrow_container {
  display: flex;
  flex: 0.06;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
  padding: 10px 0;
  cursor: pointer;
  &.left {
    border-right: $border;
  }
  &.right {
    border-left: $border;
  }
}
.task_content_body {
  display: flex;
  flex-direction: row;
  flex: 1;

  margin: 30px;
  background: white;
}
.task_main_content_wrapper {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.task_description {
  display: flex;
  flex: 1;
  background: rgb(250, 250, 250);
  border: none;
  outline: none;
  padding: 10px;
  border: $border;
}
.task_sidebar_content_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0.2;
  border-left: $border;
}
.add_items_container {
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
  font-weight: bold;
}

.add_item {
  display: flex;
  flex-direction: column;
  border-bottom: $border;
  transition: $default_transition;
  &:last-of-type {
    border: none;
  }
  .container {
    display: flex;
    align-items: center;
  }
  .add_item_body {
    border-top: $border;
    overflow-x: hidden;
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    cursor: pointer;
    @each $key, $value in $quick_actions {
      &.#{$key} {
        background: rgba($value, 0.05);
        color: rgba($value, 0.95);

        &:hover {
          color: rgba($value, 1);
          background: rgba($value, 0.05);
        }
      }
    }

    &:hover {
      background: rgb(250, 250, 250);
    }
  }
  .bx {
    margin-right: 10px;
    font-size: 1.5em;
  }
}
.team_member {
  padding: 2px 10px;
  cursor: pointer;
  font-size: 0.9em;
  &:hover {
    background: $grey;
  }
}
</style>
