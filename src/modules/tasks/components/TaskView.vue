<template>
  <div class="task_view_container">
    <!-- Task header -->
    <div class="task_view_bar">
      <div class="arrow_container left" @click="destoryComponent">
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

        <div class="task_details_grid">
          <!-- Assigned to -->
          <div class="assigned_to_container">
            <h3 class="task_title_unit grey">Assigned team members</h3>
            <div class="avatar_container">
              <Avatar
                v-for="member in task.assigned_to"
                :key="member._id"
                :name="member.name"
                :size="30"
                class="trigger"
                @click.native="goToTeam(member)"
              />
            </div>
          </div>
          <div class="due_date_display_container">
            <!-- Due date -->
            <h3 class="task_title_unit grey">Due date</h3>
            <p :class="['due_date_label capitalize', dueDateXref[true]]">
              {{ makePretty(dueDateXref[true]) }}
            </p>
          </div>
          <div class="labels_display_container">
            <!-- Labels -->
            <h3 class="task_title_unit grey">Labels</h3>
            <div class="labels_grid">
              <div
                v-for="(label, labelIndex) in task.labels"
                :key="labelIndex"
                class="label"
                :style="{ background: label.colour }"
              >
                <small>{{ label.name }}</small>
                <i
                  v-if="hasAccess"
                  class="bx bx-x delete_label trigger"
                  @click="deleteLabel(label._id)"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <div v-if="hasAccess" class="comments_wrapper">
          <h3 class="task_title_unit grey">Comments</h3>

          <Comments :comments="task.comments" :can-interact="hasAccess" />
        </div>
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
                <i class="header_icon" :class="item.icon"></i>
                <p>{{ makePretty(item.label) }}</p>
              </div>
              <i
                v-if="!item.hasOwnProperty('function')"
                :class="[
                  `bx bx-${
                    selectedItem == item.label ? 'down' : 'right'
                  }-arrow-alt grey header_icon`
                ]"
              ></i>
            </div>

            <collapse-transition>
              <!-- Members -->

              <div
                v-if="checkDrawer(item.label, 'members')"
                class="add_item_body"
                @click="$event.stopPropagation()"
              >
                <input
                  v-model="teamNameSearch"
                  type="text"
                  placeholder="Search"
                  class="team_search"
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
                @click="$event.stopPropagation()"
              >
                <!-- Navigate labels -->
                <div class="labels_nav">
                  <small>{{
                    createNewLabel ? "Create new label" : "View labels"
                  }}</small>
                  <i
                    v-if="task.labels.length > 0"
                    :class="
                      `bx bx-${
                        !createNewLabel ? 'right' : 'left'
                      }-arrow-alt trigger`
                    "
                    @click="navigateLabels"
                  ></i>
                </div>
                <div class="labels_container">
                  <!-- Viewing all labels -->
                  <div
                    v-if="task.labels.length > 0 && !createNewLabel"
                    class="labels_grid"
                  >
                    <div
                      v-for="(label, labelIndex) in task.labels"
                      :key="labelIndex"
                      class="label"
                      :style="{ background: label.colour }"
                    >
                      <small>{{ label.name }}</small>
                      <i
                        v-if="hasAccess"
                        class="bx bx-x delete_label trigger"
                        @click="deleteLabel(label._id)"
                      ></i>
                    </div>
                  </div>
                  <!-- Create new label -->
                  <div v-if="createNewLabel || task.labels.length == 0">
                    <div
                      :data-label-colour="newLabel.colour"
                      :style="{
                        background: newLabel.colour
                      }"
                      class="label"
                    >
                      <input
                        v-model="newLabel.name"
                        placeholder="Click to create new label"
                        type="text"
                        class="label_placeholder_input"
                        @keyup.enter="saveLabel"
                      />
                      <el-popover v-model="displayPopover">
                        <i
                          slot="reference"
                          class="bx bx-color-fill label_placeholder_icon trigger"
                        ></i>
                        <div class="colour_picker_container">
                          <small>Select the colour of the new label</small>
                          <ColourPicker
                            v-model="newLabel.colour"
                            :display-details="false"
                            @input="displayPopover = false"
                          />
                        </div>
                      </el-popover>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Deadlines -->

              <div
                v-if="checkDrawer(item.label, 'deadlines')"
                class="add_item_body deadline"
                @click="$event.stopPropagation()"
              >
                <!-- Current deadline -->
                <small class="grey">Set a deadline for this task</small>
                <el-date-picker
                  v-model="task.due_date"
                  class="due_date_select"
                />
                <!-- Check the due date time -->
                <p :class="['due_date_label capitalize', dueDateXref[true]]">
                  {{ makePretty(dueDateXref[true]) }}
                </p>

                <!-- update deadline -->
              </div>
            </collapse-transition>
          </div>
        </div>
      </div>
    </div>
    <!-- Popup box for cached items -->
    <PopupBox
      title="Restore previous new task"
      class="right"
      :display="displayPopup"
      @close="removeCachedTask"
    >
      <div slot="body" class="message_container">
        <p>
          Your previous task was unsaved, would you like to restore this task ?
        </p>
      </div>
      <s-button
        slot="footer"
        class="primary expanded"
        @click="restoreCachedTask"
        >Restore previous task</s-button
      >
    </PopupBox>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import SButton from "@/components/SButton";
import Comments from "./Comments";
import Avatar from "@/components/Avatar";
import PopupBox from "@/components/PopupBox";
import ColourPicker from "@/components/ColourPicker";
import { CollapseTransition, SlideXLeftTransition } from "vue2-transitions";
export default {
  name: "TaskView",
  components: {
    SButton,
    Comments,
    Avatar,
    CollapseTransition,
    SlideXLeftTransition,
    PopupBox,
    ColourPicker
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
      teamNameSearch: "",
      displayPopup: false,
      displayPopover: false,
      createNewLabel: false,
      newLabel: {
        name: "",
        colour: ""
      }
    };
  },
  computed: {
    ...mapState(["userInformation", "colours"]),
    ...mapState("Team", ["team"]),
    ...mapState("Tasks", ["boards"]),
    ...mapGetters(["adminPermission"]),

    dueDateXref() {
      let dueDateXref = {
        [this.task.due_date == null]: "no_due_date"
      };
      if (this.task.due_date) {
        let dueDate = this.initMoment(this.task.due_date);

        dueDateXref = {
          ...dueDateXref,
          [dueDate.isAfter(this.initMoment())]: "on_track",
          [dueDate.isBefore(this.initMoment())]: "overdue"
        };
      }
      return dueDateXref;
    },
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
    },
    isCached() {
      return localStorage.getItem("newTask");
    }
  },
  created() {
    for (let i = 0, len = this.edittableProperties.length; i < len; i++) {
      let property = this.edittableProperties[i];
      this.edit[property] = false;
    }
    // Restore previous unsaved
    if (this.isCached) {
      for (let property in this.isCached) {
        let val = this.isCached[property];
        if (this.task[property] && val != this.task[property]) {
          this.displayPopup = true;
          break;
        }
      }
    }
    this.newLabel.colour = this.colours[
      Math.round(Math.random() * this.colours.length)
    ];
  },

  destroyed() {
    this.destoryComponent();
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations("Tasks", [
      "DELETE_TASK",
      "CREATE_COMMENT",
      "DELETE_COMMENT"
    ]),
    deleteLabel(id) {
      let labelIndex = this.task.labels.findIndex(x => x._id == id);
      if (labelIndex > -1) {
        this.task.labels.splice(labelIndex, 1);
      }
    },
    saveLabel() {
      let newLabel = {
        ...this.newLabel,
        _id: Math.random()
          .toString(16)
          .slice(2)
      };
      this.task.labels.push(newLabel);
      this.newLabel.name = "";
    },
    navigateLabels() {
      if (this.task.labels.length > 0) {
        this.createNewLabel = !this.createNewLabel;
      }
    },
    removeCachedTask() {
      localStorage.removeItem("newTask");
      this.displayPopup = false;
    },
    restoreCachedTask() {
      this.task = this.isCached
        ? JSON.parse(localStorage.getItem("newTask"))
        : this.taskInformation;
      this.displayPopup = false;
    },
    goToTeam(member) {
      this.$router.push({
        name: "team",
        params: {
          user: member?.name
        }
      });
    },
    toggleSelectedItem(item) {
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
      let assignedIndex = this.task.assigned_to.findIndex(
        assignee => assignee._id == teamMember._id
      );

      if (assignedIndex > -1) {
        this.task.assigned_to.splice(assignedIndex, 1);
      } else {
        this.task.assigned_to.push(teamMember);
      }
    },

    destoryComponent() {
      if (this.isNewTask) {
        this.DELETE_TASK(this.indexs);
        localStorage.setItem("newTask", JSON.stringify(this.task));
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

$due_date_ref: (
  no_due_date: rgb(200, 200, 200),
  overdue: var(--danger),
  on_track: var(--green)
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
.task_title_unit {
  margin: 10px 0;
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
  padding: 10px;
  max-height: calc(100% - 220px);
  flex-direction: column;
  overflow-x: hidden;
}
.task_details_grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
.comments_wrapper {
  position: relative;
  flex: 1;
  height: 100%;
}

.task_description {
  display: flex;
  flex: 1;
  background: rgb(250, 250, 250);
  outline: none;
  border: none;
  max-height: 40%;
  border-radius: 10px;
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
    text-transform: initial;
    &.deadline {
      padding: 10px;
    }
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
  .header_icon {
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
.due_date_select {
  width: 100%;
  flex: 1;
  border: none;
  outline: none;
}
.due_date_label {
  border-radius: 5px;
  @each $key, $value in $due_date_ref {
    &.#{$key} {
      border: 1px solid rgba($value, 0.2);
      color: rgba($value, 1);
      padding: 10px;
      background: rgba($value, 0.1);
    }
  }
}

.message_container {
  padding: 20px;
}
.labels_display_container {
  max-width: 10%;
}
.labels_nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: whitesmoke;
  padding: 5px;
  display: flex;
  justify-content: space-between;
}
.labels_container {
  padding: 10px;
}
.label_placeholder {
  color: white;
  padding: 10px;
}
.labels_grid {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
}

.label {
  flex: 1;

  white-space: nowrap;
  border: none;
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-radius: 20px;
  margin: 10px;
  padding: 7px 0px 7px 10px;
  background: attr(data-label-colour);
}

.label_placeholder_input {
  border: none;
  outline: none;
  color: white;
  background: transparent;
  display: flex;
  flex: 1;
  border-radius: 20px;
  padding: 3px;

  &::placeholder {
    color: white;
  }
}
.delete_label {
  margin-right: 10px;
}
.label_placeholder_icon {
  background: rgba(0, 0, 0, 0.1);
  padding: 5px;
  border-radius: 50%;
  margin-right: 10px;
}
.colour_picker_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
