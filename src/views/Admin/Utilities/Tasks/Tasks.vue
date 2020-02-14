<template>
  <div class="todos_container p-3 overflow h-100">
    <!-- Displaying the categories -->
    <el-select
      v-model="filters.categoryFilter"
      size="mini"
      class="category_dropdown w-100"
      placeholder="Select Category View"
    >
      <el-option
        v-for="option in allCategories"
        :value="option.value"
        :key="option.value"
        :label="option.label"
      ></el-option>
    </el-select>

    <!-- Title bar displaying adding the tasks  -->
    <div class="tasks_container flex flex--space-between align_center mt-3">
      <h5 class="grey light">Viewing tasks</h5>

      <!-- Popover display -->
      <Popover title="Create Task" position="right-start" trigger="click">
        <div class="create_new_task_container" v-loading="popoverLoading" slot="content">
          <el-input placeholder="Task title or content" v-model="task.content" size="mini"></el-input>

          <!-- Displaying the categories -->
          <el-select
            v-model="task.category"
            size="mini"
            class="category_dropdown"
            placeholder="Select category"
            :disabled="task.category == 'create_new_category'"
          >
            <el-option
              v-for="option in allCategories"
              :value="option.value"
              :key="option.value"
              :label="option.label"
            ></el-option>
          </el-select>
          <br />
          <el-input
            size="mini"
            v-model="task.newCategory"
            v-if="task.category == 'create_new_category'"
            placeholder="New category name"
          ></el-input>
          <el-date-picker
            size="mini"
            v-model="task.dueDate"
            type="datetime"
            placeholder="(Optional) Select task due date"
          ></el-date-picker>
          <br />
          <!-- Displaying team members -->

          <el-select
            v-if="getIsAdmin"
            v-model="task.assignedTo"
            size="mini"
            multiple
            class="category_dropdown"
            placeholder="Assign to team member"
          >
            <el-option
              v-for="option in team"
              :value="option._id"
              :key="option.value"
              :label="option.name"
            ></el-option>
          </el-select>
          <br />

          <!-- Create task button -->
          <div class="button_container flex--end flex">
            <el-button
              round
              type="primary"
              @click="runTaskRequest()"
              :disabled="task.content.length == 0"
              size="mini"
            >Create task</el-button>
          </div>
        </div>

        <el-button icon="el-icon-plus" size="mini" circle slot="trigger"></el-button>
      </Popover>
    </div>

    <!-- Filtering tasks -->

    <div v-if="filteredTasks.length > 0">
      <TaskItem
        @taskItemChange="runTaskRequest"
        v-for="task in filteredTasks"
        :categories="allCategories"
        :taskData="task"
        :key="task._id"
      />
    </div>
    <!-- No content display on tasks -->
    <div class="h-100 flex_center" v-else>
      <Nocontent v-bind="noContent">
        <el-button size="mini" round>Create task with this category</el-button>
      </Nocontent>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import TaskItem from "./components/TaskItem";
import Nocontent from "@/components/Nocontent";
import Popover from "@/components/Popover";
import moment from "moment";
export default {
  name: "Tasks",
  data() {
    return {
      selectedCategory: "Default",
      popoverLoading: false,
      filters: {
        assignedToFilter: "",
        contentFilter: "",
        createdByFilter: "",
        stateFilter: "",
        categoryFilter: ""
      },
      task: {
        content: "",
        category: "",
        assignedTo: "",
        newCategory: "",
        dueDate: ""
      }
    };
  },

  computed: {
    ...mapState("Admin", ["tasks", "teamInformation"]),
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),

    noContent() {
      return {
        text: "No Todos found, press the add button below to create a new task",
        icon: "el-icon-plus",
        buttonText: "Create New Task"
      };
    },

    filteredTasks() {
      let filteredTasks = [];

      let {
        stateFilter,
        contentFilter,
        assignedToFilter,
        createdBy,
        categoryFilter
      } = this.filters;

      for (let i = 0, len = this.returnTasks.length; i < len; i++) {
        let task = this.returnTasks[i];
        const {
          category,
          state,
          content,
          assignedTo,
          createdBy
        } = this.returnTasks[i];

        if (
          category != categoryFilter &&
          categoryFilter == "create_new_category"
        ) {
          continue;
        }

        filteredTasks.push(task);
      }

      return filteredTasks;
    },

    allCategories() {
      let allCategories = [];

      this.returnTasks.map(task => {
        let optionsObject = {
          value: task.category,
          label: task.category
        };

        allCategories.findIndex(option => {
          return task.category == option.label;
        }) < 0
          ? allCategories.push(optionsObject)
          : null;
      });

      allCategories.push({
        label: "+ Create new category",
        value: "create_new_category"
      });
      return allCategories;
    },
    returnTasks() {
      return this.tasks;
    },
    options() {
      return [
        {
          value: "value",
          label: "Label"
        }
      ];
    }
  },

  methods: {
    ...mapActions("Admin", ["getTasks"]),
    ...mapActions(["request"]),
    // Pushes a new todo
    runTaskRequest(taskData) {
      this.popoverLoading = true;

      let url = "tasks/create",
        method = "POST",
        data = this.task;

      if (taskData) {
        url = "tasks/edit";
        data = { _id: taskData._id, update: { ...taskData } };
      }

      if (this.task.dueDate) {
        data.dueDate = moment(data.dueDate).toISOString();
      }

      if (this.task.newCategory.length > 0) {
        data.category = this.task.newCategory;
        delete data.newCategory;
      }
      this.request({
        url,
        data,
        method
      })
        .then(response => {
          this.popoverLoading = false;
          console.log(response);
          this.getTasks();
        })
        .catch(err => {
          this.$set(this, "task", {});
          this.popoverLoading = false;
          console.error(err);
        });
    }
  },

  components: {
    TaskItem,
    Nocontent,
    Popover
  }
};
</script>

<style lang="scss" scoped>
.todos_container {
  scroll-padding: 40px 0;
  box-shadow: $box_shadow;
  max-width: 20%;
  min-width: 15%;
}
.create_new_task_container {
  line-height: 3em;
}
</style>
