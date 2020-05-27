<template>
  <div class="task_view_container">
    <!-- Task header -->
    <div class="task_view_bar">
      <div class="arrow_container left" @click="destoryComponent">
        <i class="bx bx-left-arrow-alt grey"></i>
      </div>
      <div class="text_container">
        <input
          v-model="task.name"
          :disabled="!hasAccess"
          type="text"
          :placeholder="isNewTask ? 'Task name...' : task.name"
          class="new_task_input"
          :class="{ disabled: isComplete }"
        />

        <h2 class="grey capitalize">{{ boardData.name }}</h2>
      </div>
      <div class="mark_as_complete trigger">
        <i
          v-if="!isNewTask"
          class="bx bx-check"
          :class="{ active: isComplete, disabled: isComplete }"
          @click="completeTask"
        ></i>
      </div>
    </div>

    <!-- Task content -->
    <div class="task_content_body">
      <div class="task_main_content_wrapper">
        <div class="task_details_grid">
          <!-- Assigned to -->
          <div class="assigned_to_container unit">
            <h3 class="task_title_unit grey">Assigned team members</h3>
            <div class="avatar_container grouped">
              <Avatar
                v-for="member in task.assigned_to"
                :key="member._id"
                :name="member.name"
                :size="30"
                class="trigger"
                multiple
                @click.native="goToTeam(member)"
              />
            </div>
          </div>
          <div class="due_date_display_container unit">
            <!-- Due date -->
            <h3 class="task_title_unit grey">Due date</h3>
            <p
              :class="['due_date_label capitalize', dueDateXref[true]]"
              @click="selectedItem = 'deadlines'"
            >
              {{ makePretty(dueDateXref[true]) }}
            </p>
          </div>
          <div class="labels_display_container unit">
            <!-- Labels -->
            <h3 class="task_title_unit grey">Labels</h3>
            <div v-if="task.labels.length > 0" class="labels_grid">
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
            <h3 v-else class="grey">No labels</h3>
          </div>
        </div>
        <h3 class="task_title_unit grey">Task description</h3>
        <textarea
          v-model="task.description"
          class="task_description"
          :placeholder="task.description"
          :disabled="!hasAccess"
        ></textarea>
      </div>
      <template v-if="hasAccess">
        <Comments
          :comments="task.comments"
          :can-interact="hasAccess"
          @createComment="createComment"
          @deleteComment="deleteComment"
        />
      </template>

      <!-- Task sidebar -->
      <div class="task_sidebar_content_wrapper">
        <!-- Add items -->
        <div class="add_items_container">
          <div
            v-for="(item, index) in addItems"
            :key="index"
            v-loading="loading == item.label"
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
                  class="s_input team_search"
                />
                <div
                  v-for="member in filteredTeam"
                  :key="member._id"
                  :class="[
                    'team_member',
                    {
                      assigned: checkIsAssigned(member) > -1
                    }
                  ]"
                  @click="toggleAssignedTeamMember(member)"
                >
                  <p>
                    <span>{{ member.name }}</span>
                    <i
                      v-if="checkIsAssigned(member) > -1"
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
                        @keyup.enter="
                          $event.stopPropagation();
                          saveLabel();
                        "
                      />
                      <el-popover v-model="displayPopover">
                        <i
                          slot="reference"
                          class="bx bx-color-fill label_placeholder_icon trigger"
                        ></i>
                        <div class="colour_picker_container">
                          <p>Select the colour of the new label</p>
                          <SketchPicker
                            v-model="newLabel.colour"
                            :preset-colors="colours"
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

                <div class="deadline_navigation">
                  <small>{{
                    assignedToEvent
                      ? "Set deadline"
                      : "Assign to event deadline"
                  }}</small>
                  <i
                    class="bx bx-right-arrow-alt trigger"
                    @click="deadlineNavigation"
                  ></i>
                </div>
                <div class="deadline_nav_wrapper">
                  <div v-if="assignedToEvent">
                    <div class="button_date_create">
                      <small
                        v-for="(button, dateButtonIndex) in dateIncreaseButtons"
                        :key="dateButtonIndex"
                        class="date_button trigger"
                        @click="increaseTime(button)"
                        >+1 {{ button }}
                      </small>
                    </div>

                    <el-date-picker
                      v-model="task.due_date"
                      class="due_date_select"
                    />
                    <!-- Check the due date time -->
                    <p
                      v-if="!isNewTask"
                      :class="['due_date_label capitalize', dueDateXref[true]]"
                    >
                      {{ makePretty(dueDateXref[true]) }}
                    </p>
                    <!-- Assign deadline to end of event -->
                  </div>
                  <div v-if="!assignedToEvent && eventsToAssign.length > 0">
                    <div
                      v-for="(event, eventIndex) in eventsToAssign"
                      :key="eventIndex"
                      class="event trigger"
                      @click="assignEventTime(event.end_date.val)"
                    >
                      <small> {{ event.label }} </small>
                      <small> End date: {{ event.end_date.label }} </small>
                    </div>
                  </div>
                  <!-- No events to assign -->
                  <div
                    v-if="eventsToAssign.length == 0 && !assignedToEvent"
                    class="text_container all_centre"
                  >
                    <p class="grey">No event to assign</p>
                  </div>
                </div>
              </div>
            </collapse-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapMutations, mapActions } from "vuex";
import { CollapseTransition, SlideXLeftTransition } from "vue2-transitions";

import Comments from "./Comments";

import genID from "@/mixins/genID";

import SButton from "@/components/SButton";
import Avatar from "@/components/Avatar";
import { Sketch } from "vue-color";

export default {
  name: "TaskView",
  components: {
    SButton,
    Comments,
    Avatar,
    CollapseTransition,
    SlideXLeftTransition,
    SketchPicker: Sketch
  },
  mixins: [genID],
  props: {
    taskInformation: {
      type: Object,
      default: () => {}
    },
    boardIndex: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      edit: {},
      selectedItem: "",
      task: {},
      teamNameSearch: "",
      displayPopup: false,
      displayPopover: false,
      createNewLabel: false,
      loading: "",
      newLabel: {
        name: "",
        colour: ""
      },
      hasChanged: false,
      assignedToEvent: false
    };
  },
  computed: {
    ...mapState(["userInformation", "colours"]),
    ...mapState("Team", ["team"]),
    ...mapState("Tasks", ["boards"]),
    ...mapState("Events", ["events"]),
    ...mapGetters(["adminPermission"]),

    isComplete() {
      return this.task.state == 3;
    },

    eventsToAssign() {
      let filteredEvents = [];
      for (let i = 0, len = this.events.length; i < len; i++) {
        let { start_date, end_date, type } = this.events[i];
        let isEventAfterToday = this.initMoment(start_date).isAfter(
          this.initMoment()
        );

        if (isEventAfterToday) {
          let { label } = type;
          filteredEvents.push({
            start_date: { val: start_date, label: this.formatDate(start_date) },
            end_date: { label: this.formatDate(end_date), val: end_date },
            label
          });
        }
      }

      return filteredEvents;
    },

    dateIncreaseButtons() {
      return ["day", "week", "month", "year"];
    },

    defaultTaskXref() {
      return {
        name: "Blank task",
        description: "blank task description"
      };
    },

    dueDateXref() {
      let dueDateXref = {
        [this.task.due_date == null]: "no_due_date"
      };
      if (this.task.due_date) {
        let dueDate = this.initMoment(this.task.due_date);

        dueDateXref = {
          ...dueDateXref,
          [dueDate.isAfter(this.initMoment())]: "on_time",
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
      let search = this.teamNameSearch.toLowerCase();
      let filteredTeam = this.team.filter(x =>
        x.name.toLowerCase().includes(search)
      );
      return filteredTeam.length > 0 ? filteredTeam : this.team;
    },
    isNewTask() {
      return this.task.newTask ?? false;
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
        },

        {
          label: "Save",
          class: "save_task",
          icon: "bx bx-download",
          function: this.saveTask
        }
      ];

      if (!this.isNewTask && this.hasAccess) {
        quickActions.push({
          label: "delete_task",
          icon: "bx bx-trash",
          class: "delete_task",
          function: () => {
            if (this.isNewTask) {
              this.$emit("toggle");
            } else {
              this.deleteTask();
            }
          }
        });
      }

      if (this.isComplete) {
        let saveActionIndex = quickActions.length - 2;
        let saveAction = quickActions[saveActionIndex];

        quickActions[saveActionIndex] = Object.assign(saveAction, {
          icon: "bx bx-check",
          label: "Task already completed"
        });
        delete quickActions[saveActionIndex].function;
      }

      return quickActions;
    },
    edittableProperties() {
      return ["name", "description"];
    },
    boardData() {
      return this.boards[this.boardIndex];
    },
    isAssignedToUser() {
      return this.task.assigned_to.some(user => {
        return user?._id == this.userInformation._id;
      });
    },
    hasAccess() {
      return this.adminPermission || this.isAssignedToUser;
    }
  },

  created() {
    window.addEventListener("keyup", this.keyListener);
    this.loadTask();

    for (let i = 0, len = this.edittableProperties.length; i < len; i++) {
      let property = this.edittableProperties[i];
      this.edit[property] = false;
    }

    this.genLabelColour();
  },

  destroyed() {
    this.destoryComponent();
  },

  methods: {
    ...mapActions(["request"]),
    ...mapMutations(["CREATE_SYSTEM_NOTIFICATION"]),
    ...mapMutations("Tasks", ["UPDATE_TASKS", "CREATE_TASK", "DELETE_TASK"]),
    assignEventTime(date) {
      this.task.due_date = date;
      this.CREATE_SYSTEM_NOTIFICATION({
        title: "Due date update",
        message: "Task due date assigned to event",
        icon: "timer"
      });
    },

    async deleteTask() {
      try {
        let { _id } = this.task;

        this.$emit("toggle");
        this.DELETE_TASK({
          boardIndex: this.boardIndex,
          taskIndex: this.task.taskIndex
        });
        await this.request({
          method: "DELETE",
          url: "tasks/delete",
          data: { _id }
        });
      } catch (error) {
        console.error(error);
      }
    },

    increaseTime(timeGap) {
      let currentTime = this.task.due_date ? this.task.due_date : new Date();
      this.task.due_date = this.initMoment(currentTime)
        .add(1, timeGap)
        .toISOString();
    },

    async saveTask() {
      try {
        this.loading = "save_task";
        let { newTask, ...taskData } = this.task;
        let taskPayload = {
          method: "POST",
          url: "tasks/create",
          data: taskData
        };

        taskData.board_id = this.boardData._id;

        if (!this.isNewTask) {
          taskPayload = {
            method: "PUT",
            url: "tasks/update",
            data: { _id: this.task._id, update: taskData }
          };
          let { boardIndex, taskIndex, ...update } = taskData;

          this.UPDATE_TASKS({
            boardIndex,
            taskIndex,
            update
          });
        } else {
          if (!this.task.name) {
            this.task.name = "Blank name";
            taskData.name = "Blank name";
          }
          if (!this.task.description) {
            this.task.description = "Blank description";
            taskData.description = "Blank description";
          }

          this.CREATE_TASK(
            Object.assign(taskData, {
              boardIndex: this.boardIndex,
              local: true
            })
          );
        }

        taskData.assigned_to = taskData.assigned_to.map(assignee => {
          return assignee._id;
        });

        let res = await this.request(taskPayload);
        this.loading = "";
        this.selectedItem = "";

        if (this.isNewTask) {
          this.UPDATE_TASKS({
            boardIndex: this.boardIndex,
            taskIndex: this.boards[this.boardIndex].tasks.length - 1,
            update: res
          });
          this.CREATE_SYSTEM_NOTIFICATION({
            message: "Task successfully updated",
            type: "success"
          });
        }
      } catch (error) {
        this.loading = "";
        this.selectedItem = "";

        if (this.isNewTask) {
          // Remove the new task
          this.DELETE_TASK({
            boardIndex: this.boardIndex,
            taskIndex: this.boards[this.boardIndex].tasks.length - 1
          });
        }

        console.warn(error);
      }
    },
    genLabelColour() {
      this.newLabel.colour = this.colours[
        Math.round(Math.random() * this.colours.length)
      ];
    },
    deadlineNavigation() {
      this.assignedToEvent = !this.assignedToEvent;
    },
    loadTask() {
      let task = {
        _id: this.genID(),
        name: "",
        description: "",
        due_date: null,
        assigned_to: [this.userInformation],
        labels: [],
        comments: [],
        newTask: true,
        state: 0,
        boardIndex: this.boardIndex,
        taskIndex: this.taskIndex
      };
      if (
        this.taskInformation &&
        Object.keys(this.taskInformation).length > 0
      ) {
        task = this.taskInformation;
      }
      this.task = Object.assign({}, this.task, task);
    },
    deleteLabel(id) {
      let labelIndex = this.task.labels.findIndex(x => x._id == id);
      if (labelIndex > -1) {
        this.task.labels.splice(labelIndex, 1);
      }
    },
    checkIsAssigned(member) {
      return this.task.assigned_to.findIndex(x => {
        return x._id == member._id;
      });
    },
    saveLabel() {
      let newLabel = {
        ...this.newLabel,
        _id: this.genID()
      };
      this.task.labels.push(newLabel);
      this.newLabel.name = "";
      this.genLabelColour();
    },
    navigateLabels() {
      if (this.task.labels.length > 0) {
        this.createNewLabel = !this.createNewLabel;
      }
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
    toggleAssignedTeamMember(teamMember) {
      let assignedIndex = this.checkIsAssigned(teamMember);

      if (assignedIndex > -1) {
        this.task.assigned_to.splice(assignedIndex, 1);
      } else {
        this.task.assigned_to.push(teamMember);
      }
    },
    keyListener(e) {
      switch (e.key) {
        case "Escape": {
          this.$emit("toggle");
          break;
        }

        case "Enter": {
          this.saveTask();
          break;
        }

        default:
          break;
      }
    },
    destoryComponent() {
      if (this.isNewTask) {
        localStorage.setItem("newTask", JSON.stringify(this.task));
      }
      this.$emit("toggle");
      if (this.hasChanged) {
        this.saveTask();
      }
      window.removeEventListener("keyup", this.keyListener);
    },

    checkDrawer(label, match) {
      return (
        label.toLowerCase() == match && this.selectedItem.toLowerCase() == match
      );
    },
    deleteComment(commentIndex) {
      this.task.comments.splice(commentIndex, 1);
    },
    completeTask() {
      this.task.state = 3;
      this.task.complete_date = new Date().toISOString();

      this.saveTask();
    },
    createComment({ message }) {
      let comment = {
        message,
        _id: this.genID(),
        task_id: this.task._id,
        assigned_to: this.userInformation,
        updated: false,
        date_created: new Date()
      };
      this.task.comments.push(comment);
    }
  }
};
</script>

<style lang="scss" scoped>
$quick_actions: (
  save_task: var(--green),
  delete_task: var(--danger),
  reset_task: var(--dark)
);

$due_date_ref: (
  no_due_date: rgb(200, 200, 200),
  overdue: var(--danger),
  on_time: var(--green)
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
.new_task_input {
  font-size: 3em;
  border: none;
  outline: none;
  text-transform: capitalize;
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
  max-height: calc(100% - 150px);
  background: white;
}
.task_main_content_wrapper {
  display: flex;
  flex: 1;
  padding: 30px;
  flex-direction: column;
}
.task_details_grid {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  .unit {
    display: flex;
    flex: 1;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0 20px;
  }
}

.task_description {
  outline: none;
  border: $border;
  flex: 1;
  border-radius: 10px;
  padding: 10px;
  font-size: 1em;
  background: rgb(250, 250, 250);
}

.task_sidebar_content_wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 0.4;
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
        border-bottom: 1px solid rgba($value, 0.95);

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
  position: sticky;
  top: 0px;
  border-radius: 0px;
  background: white;
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
      font-size: 0.9em;
    }
  }
}

.message_container {
  padding: 20px;
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
  max-height: 31px;
  white-space: nowrap;
  border: none;
  outline: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-radius: 10px;
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
  border-radius: 10px;
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
.deadline_navigation {
  background: whitesmoke;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button_date_create {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  padding: 10px 0;
  justify-content: space-between;
}
.date_button {
  text-align: center;
  background: whitesmoke;
  color: #999;
  padding: 10px 15px;
  border-radius: 50px;
  &:hover {
    color: #555;
  }
}
.deadline_nav_wrapper {
  padding: 10px;
}
.deadline_navigation {
  position: sticky;
  top: 0;
  padding: 5px;
}
.event {
  padding: 10px;
  margin: 5px 0;
  text-transform: capitalize;
  border: $border;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mark_as_complete {
  font-size: 2em;
  margin-right: 30px;
  display: flex;
  align-items: center;

  .bx {
    border-radius: 50%;
    border: $border;
    padding: 20px;
    transition: $default_transition;
    &.active,
    &:hover {
      background: rgba(var(--success), 0.7);
      color: white;
    }
  }
}
</style>
