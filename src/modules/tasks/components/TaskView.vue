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
          class="task_description"
          :placeholder="task.description"
          :disabled="!hasAccess"
        ></textarea>
        {{ task.description }}

        <!-- Assigned to -->
        <div class="assigned_to_container">
          <h3 class="task_title_unit grey">Assigned team members</h3>
          <div class="avatar_container">
            <div @click="goToTeam(member)">
              <Avatar
                v-for="member in task.assigned_to"
                :key="member._id"
                :name="member.name"
                :size="30"
                class="trigger"
              />
            </div>
          </div>
        </div>
        <span class="json_display">{{ task }}</span>
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
                <input
                  v-model="teamNameSearch"
                  type="text"
                  placeholder="Search"
                  class="team_search"
                  @click="$event.stopPropagation()"
                />
                <div
                  v-for="member in filteredTeam"
                  :key="member._id"
                  :class="[
                    'team_member',
                    {
                      assigned:
                        task.assigned_to.findIndex(
                          assignee => assignee._id == member._id
                        ) > -1
                    }
                  ]"
                  @click="toggleAssignedTeamMember($event, member)"
                >
                  <p>
                    <span>{{ member.name }}</span>
                    <i
                      v-if="
                        task.assigned_to.findIndex(
                          assignee => assignee._id == member._id
                        ) > -1
                      "
                      class="bx bx-check"
                    />
                  </p>
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
import Avatar from "@/components/Avatar";

import { CollapseTransition } from "vue2-transitions";
export default {
  name: "TaskView",
  components: {
    SButton,
    Comments,
    Avatar,
    CollapseTransition
  },
  props: {
    taskInformation: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      edit: {},
      selectedItem: "",
      task: this.taskInformation,
      teamNameSearch: ""
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Team", ["team"]),
    ...mapState("Tasks", ["boards"]),
    taskStateXref() {
      return {
        0: "todo",
        1: "doing",
        2: "done",
        3: "defer"
      };
    },
    state() {
      return this.taskStateXref[this.task.state];
    },
    isPastDeadline() {
      return this.task.due_date
        ? this.initMoment().isAfter(this.initMoment(this.task.due_date))
        : false;
    },
    filteredTeam() {
      return this.team.filter(x =>
        x.name.toLowerCase().includes(this.teamNameSearch.toLowerCase())
      );
    },
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
        }
      ];
      if (this.isNewTask) {
        quickActions.push({
          label: "Save",
          class: "save_task",
          icon: "bx bx-download",
          function: () => {
            this.$emit("saveTask");
          }
        });
      }
      if (!this.isNewTask && this.hasAccess) {
        quickActions.push({
          label: "delete_task",
          icon: "bx bx-trash",
          class: "delete_task",
          function: () => {
            this.DELETE_TASK(this.indexs);
            this.$emit("toggle");
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
    }
  },
  created() {
    for (let i = 0, len = this.edittableProperties.length; i < len; i++) {
      let property = this.edittableProperties[i];
      this.edit[property] = false;
    }
  },

  destroyed() {
    this.goBack();
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Tasks", [
      "DELETE_TASK",
      "CREATE_COMMENT",
      "DELETE_COMMENT"
    ]),
    goToTeam(member) {
      this.$router.push({
        name: "team",
        params: {
          user: member.name
        }
      });
    },
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
    toggleAssignedTeamMember(e, teamMember) {
      e.stopPropagation();
      let assignedIndex = this.task.assigned_to.findIndex(
        assignee => assignee._id == teamMember._id
      );

      if (assignedIndex > -1) {
        this.task.assigned_to.splice(assignedIndex, 1);
      } else {
        this.task.assigned_to.push(teamMember);
      }

      // If already assigned remove them

      // Else add them
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
  max-height: calc(100% - 220px);
  flex-direction: column;
  overflow-x: hidden;
}

.task_description {
  display: flex;
  flex: 1;
  background: rgb(250, 250, 250);
  outline: none;
  border: none;
  padding: 10px;
}
.avatar_container {
  display: flex;
  align-items: center;
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
    max-height: 400px; // change for more dynamic sizing
    position: relative;
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
.team_search {
  border: none;
  background: rgb(250, 250, 250);
  padding: 10px;
  display: flex;
  flex: 1;
  width: 100%;
  position: sticky;
  top: 0px;
}

.team_member {
  padding: 2px 10px;
  cursor: pointer;
  font-size: 0.9em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.assigned {
    background: rgba(var(--green), 0.05);
    color: rgba(var(--green), 0.95);
  }
  &:hover {
    background: $grey;
  }
}
</style>
