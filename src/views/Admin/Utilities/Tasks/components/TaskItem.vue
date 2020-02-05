<template>
  <div
    v-if="Object.values(task).length > 1"
    class="taskitem_container flex align_center columns"
    :class="[
      { enabled: isOwnedByMe },
      { disabled: isComplete && !isOwnedByMe }
    ]"
  >
    <div class="flex flex--start mb-3">
      <el-button
        v-if="task.state == 'complete'"
        circle
        type="success"
        size="mini"
        icon="el-icon-check"
        :disabled="true"
      ></el-button>
    </div>
    <!-- Content -->
    <div class="flex align_center flex--space-between">
      <h4
        v-if="!displayContentEdit"
        @click="displayContentEdit = !displayContentEdit"
        class="description light task_content"
        :class="[{ overdue: isOverdue }]"
      >
        {{ task.content }}
      </h4>
      <el-input
        size="p"
        v-if="displayContentEdit"
        v-click-outside="
          () => {
            displayContentEdit = false;
          }
        "
        v-model="task.content"
      ></el-input>
    </div>

    <div class="more_details_container ">
      <!-- Assigned To -->
      <p class="grey">
        Assigned to
        <span class="black">{{ findTeamMember }}</span>
      </p>
      <br />
      <!-- Category -->
      <Dropdown
        :icon="false"
        :items="dropDownCategories"
        @method="categoryDropdownController"
      >
        <span class="grey">
          Category
          <span :style="{ color: clientInformation.colours }">
            {{ task.category }}
          </span>
        </span>
      </Dropdown>
      <br />

      <!-- Task status -->
      <Dropdown
        :icon="false"
        :items="dropDownStates"
        @method="stateDropdownController"
      >
        <el-tag :type="stateColour" class="capitalize mt-2" size="mini">
          {{ task.state }}
        </el-tag>
      </Dropdown>
    </div>

    <!-- Dates with view more -->
    <p class="view_more_indicator mt-4" @click="viewingMore = !viewingMore">
      View More
      <i
        class="rotate_icon el-icon-arrow-right"
        :class="{ active: viewingMore }"
      ></i>
    </p>
    <!-- Dates display -->
    <el-collapse-transition>
      <div class="dates_container mt-3 grey" v-if="viewingMore">
        <p>Due date {{ formattedDates.dueDate }}</p>
        <br />
        <p>Date created {{ formattedDates.dateCreated }}</p>
      </div>
    </el-collapse-transition>

    <div class="flex flex--end">
      <el-button
        round
        size="mini"
        plain
        @click="requestChanges"
        v-if="hasChanged && manualOverrideHasChanged"
        >Update</el-button
      >
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapState, mapGetters } from "vuex";
import Dropdown from "@/components/Dropdown";
export default {
  name: "TaskItem",

  data() {
    return {
      now: moment(),
      viewingMore: false,
      displayContentEdit: false,
      manualOverrideHasChanged: true,
      task: {}
    };
  },

  created() {
    this.$set(this, "task", { ...this.taskData });
  },

  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapGetters(["getIsAdmin"]),
    ...mapState("Admin", ["team"]),

    hasChanged() {
      let hasChanged;
      for (let property in this.task) {
        if (this.task[property] != this.taskData[property]) {
          hasChanged = true;
        }
      }
      return hasChanged;
    },

    isOwnedByMe() {
      return (
        this.taskData.createdBy == this.userInformation._id ||
        this.getIsAdmin ||
        this.taskData.assignedTo == this.userInformation._id
      );
    },

    stateColour() {
      switch (this.task.state) {
        case "incomplete": {
          return "info";
          break;
        }

        case "complete": {
          return "success";
          break;
        }

        case "overdue": {
          return "danger";
          break;
        }

        default:
          return "primary";
      }
    },

    dropDownStates() {
      let states = [
        {
          name: "Overdue",
          command: "overdue"
        },

        {
          name: "Incomplete",
          command: "incomplete"
        },
        {
          name: "Pending",
          command: "pending"
        },
        {
          name: "Deferred",
          command: "deferred"
        },
        {
          name: "In progress",
          command: "in progress"
        },
        {
          name: "Completed",
          command: "complete"
        }
      ];
      return states.filter(state => {
        return state.command != this.task.state;
      });
    },

    dropDownCategories() {
      return this.categories.map(category => {
        return {
          name: category.label,
          command: category.label
        };
      });
    },

    category() {
      return this.taskData.category;
    },

    timeOverDue() {
      return moment(this.createdDate).calendar();
    },

    formattedDates() {
      return {
        dueDate: moment(this.taskData.dueDate).calendar(),
        dateCreated: moment(this.taskData.createdDate).calendar()
      };
    },

    isAssignedToMe() {
      return this.taskData.createdBy == this.userInformation._id;
    },

    isOverdue() {
      return (
        moment(this.task.dateCreated).isBefore(moment(this.task.dueDate)) &&
        this.status == "complete"
      );
    },

    isComplete() {
      return this.task.state == "complete";
    },

    findTeamMember() {
      let foundMember = "John Doe";

      if (!this.isAssignedToMe) {
        let foundTeamMember = this.team.find(member => {
          return member._id == this.taskData.assignedTo;
        });

        if (foundTeamMember && Object.keys(foundTeamMember).length > 0) {
          foundMember = foundTeamMember;
        }
      }
      return foundMember;
    }
  },
  methods: {
    requestChanges() {
      this.$emit("taskItemChange", this.task);
      this.$set(this, "manualOverrideHasChanged", false);
    },
    categoryDropdownController(command) {
      this.$set(this.task, "category", command);
    },

    stateDropdownController(command) {
      this.$set(this.task, "state", command);
    },

    updateTask() {
      this.request({
        method: "POST",
        url: "task/update",
        data: { id: this.taskData._id }
      });
    }
  },
  props: {
    categories: {
      type: Array
    },
    taskData: {
      type: Object
    }
  },
  components: {
    Dropdown
  }
};
</script>

<style lang="scss" scoped>
.taskitem_container {
  border-bottom: $border;
  font-size: 0.8em;
  l &.enabled {
    opacity: 1;
    cursor: initial;
  }
}

.rotate_icon {
  transition: 0.25s linear transform;
  &.active {
    transform: rotate(90deg);
  }
}
.view_more_indicator {
  cursor: pointer;
}
</style>
