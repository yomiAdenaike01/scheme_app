<template>
  <slide-x-left-transition>
    <div class="todos_container p-3 overflow h-100">
      <!-- Displaying the categories -->
      <el-select
        v-model="selectedCategory"
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
      <div class="tasks_container flex flex--space-between align_center mt-3 ">
        <h5 class="grey light">Viewing tasks</h5>

        <!-- Popover display -->
        <Popover title="Create Task" position="right-start"  trigger="click">
          <div class="create_new_task_container" slot="content">
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
            <br>
<el-input size="mini" v-model="task.newCategory" v-if="task.category == 'create_new_category'" placeholder="New category name"></el-input>

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
            <br>

<!-- Create task button -->
<div class="button_container flex--end flex">
            <el-button round type="primary" @click="runTaskRequest" :disabled="task.content.length == 0" size="mini"
              >Create task</el-button
            >
            </div>
          </div>

          <el-button
            icon="el-icon-plus"
            size="mini"
            circle
            slot="trigger"
          ></el-button>
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

      <div class="h-100 flex_center" v-else>
        <Nocontent v-bind="noContent">
          <el-button size="mini" round
            >Create task with this category</el-button
          >
        </Nocontent>
      </div>
    </div>
  </slide-x-left-transition>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import TaskItem from "./components/TaskItem";
import { SlideXLeftTransition } from "vue2-transitions";
import Nocontent from "@/components/Nocontent";
import Popover from "@/components/Popover";
export default {
  name: "Tasks",
  data() {
    return {
      selectedCategory: "Default",
      task: {
        content: "",
        category:"",
        assignedTo:"",
        newCategory:""
      }
    };
  },
  computed: {
    ...mapState("Admin", ["tasks","team"]),
    ...mapState(["userInformation"]),
    ...mapGetters(['getIsAdmin']),

    teamMembersDropdown(){

    },

    noContent() {
      return {
        text: "No Todos found, press the add button below to create a new task",
        icon: "el-icon-plus",
        buttonText: "Create New Task"
      };
    },

    filteredTasks() {
      return this.returnTasks.filter(task => {
        return task.category == this.selectedCategory;
      });
    },

    allCategories() {
      let allCategories = [
        
      ];

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
            label:'+ Create new category',
            value:'create_new_category'
        })
      return allCategories;
    },
    returnTasks() {
      return [
        {
          id: 1,
          dueDate: "2019-11-17T02:49:31Z",
          createdBy: "5e360b8dfbf269a23807a944",
          assignedTo: "5e3607cc63ad74945c5cbb0f",
          state: "complete",
          content:
            "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
          completeDate: "2019-08-16T04:47:35Z",
          dateCreated: "2019-12-03T06:43:25Z",
          category: "Default"
        },
        {
          id: 2,
          dueDate: "2019-06-02T10:27:38Z",
          createdBy: "5e3607cc63ad74945c5cbb0f",
          assignedTo: "d20a49c5-0f72-4a13-a52a-b4d2a11b26dd",
          state: "incomplete",
          content:
            "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
          completeDate: "2020-06-30T00:49:15Z",
          dateCreated: "2020-05-23T16:16:25Z",
          category: "Default"
        },
        {
          id: 2,
          dueDate: "2019-06-02T10:27:38Z",
          createdBy: "5e3607cc63ad74945c5cbb0f",
          assignedTo: "d20a49c5-0f72-4a13-a52a-b4d2a11b26dd",
          state: "incomplete",
          content:
            "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
          completeDate: "2020-06-30T00:49:15Z",
          dateCreated: "2020-05-23T16:16:25Z",
          category: "Default"
        },
        {
          id: 3,
          dueDate: "2019-12-07T12:54:40Z",
          createdBy: "5e3607cc63ad74945c5cbb0f",
          assignedTo: "e8160bc8-2b9a-42c3-b8e7-5ec27131361e",
          state: "complete",
          content:
            "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
          completeDate: "2020-04-24T08:09:55Z",
          dateCreated: "2019-09-09T13:47:21Z",
          category: "Default"
        },
        {
          id: 4,
          dueDate: "2020-01-16T17:44:43Z",
          createdBy: "5e360b8dfbf269a23807a944",
          assignedTo: "5e3607cc63ad74945c5cbb0f",
          state: "incomplete",
          content:
            "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
          completeDate: "2020-11-12T02:25:41Z",
          dateCreated: "2019-06-08T08:26:58Z",
          category: "Default"
        },
        {
          id: 1,
          dueDate: "2019-11-17T02:49:31Z",
          createdBy: "5e360b8dfbf269a23807a944",
          assignedTo: "5e3607cc63ad74945c5cbb0f",
          state: "complete",
          content:
            "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
          completeDate: "2019-08-16T04:47:35Z",
          dateCreated: "2019-12-03T06:43:25Z",
          category: "Default"
        },
        {
          id: 2,
          dueDate: "2019-06-02T10:27:38Z",
          createdBy: "5e3607cc63ad74945c5cbb0f",
          assignedTo: "d20a49c5-0f72-4a13-a52a-b4d2a11b26dd",
          state: "incomplete",
          content:
            "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
          completeDate: "2020-06-30T00:49:15Z",
          dateCreated: "2020-05-23T16:16:25Z",
          category: "Default"
        },
        {
          id: 2,
          dueDate: "2019-06-02T10:27:38Z",
          createdBy: "5e3607cc63ad74945c5cbb0f",
          assignedTo: "d20a49c5-0f72-4a13-a52a-b4d2a11b26dd",
          state: "incomplete",
          content:
            "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.",
          completeDate: "2020-06-30T00:49:15Z",
          dateCreated: "2020-05-23T16:16:25Z",
          category: "Default"
        },
        {
          id: 3,
          dueDate: "2019-12-07T12:54:40Z",
          createdBy: "5e3607cc63ad74945c5cbb0f",
          assignedTo: "e8160bc8-2b9a-42c3-b8e7-5ec27131361e",
          state: "complete",
          content:
            "Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
          completeDate: "2020-04-24T08:09:55Z",
          dateCreated: "2019-09-09T13:47:21Z",
          category: "Default"
        },
        {
          id: 4,
          dueDate: "2020-01-16T17:44:43Z",
          createdBy: "5e360b8dfbf269a23807a944",
          assignedTo: "5e3607cc63ad74945c5cbb0f",
          state: "incomplete",
          content:
            "Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est.\n\nPhasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.\n\nProin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
          completeDate: "2020-11-12T02:25:41Z",
          dateCreated: "2019-06-08T08:26:58Z",
          category: "Default"
        }
      ];
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
      ...mapActions('Admin',['getTasks']),
    // Pushes a new todo
    runTaskRequest(taskData){
        
        let url="task/create",method="POST",data = this.task;

        if(taskData){
            url="task/update"
            data = {update:{...taskData}}
        }

        if(this.task.newCategory.length > 0){
            data.category = this.task.newCategory
        }

        this.request({
            url,
            data,
            method
        }).then(response=>{
            console.log(response);
            this.getTasks();
        })


    }
  },

  components: {
    TaskItem,
    SlideXLeftTransition,
    Nocontent,
    Popover
  }
};
</script>

<style lang="scss" scoped>
.todos_container {
  scroll-padding: 40px 0;
  box-shadow: $box_shadow;
  max-width: 15%;
}
.create_new_task_container{
    line-height: 3em;
}

</style>
