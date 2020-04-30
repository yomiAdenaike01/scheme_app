<template>
  <el-dialog :visible.sync="view">
    <div v-loading="loading" class="create_task_container">
      <InformationDisplay
        :display-text="{
          heading: `Create task for <strong>${boardData.name}</strong>`,
          content: 'Fill in the form below to create a new task'
        }"
      />
      <div class="form_container">
        <Form
          :config="createTaskForm"
          submit-text="Create task"
          @val="createAction"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
export default {
  name: "CreateTask",
  components: {
    Form: () => import("@/components/Form"),
    InformationDisplay: () => import("@/components/InformationDisplay")
  },
  props: {
    display: {
      type: Boolean,
      default: false
    },
    createTaskInformation: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["team", "clientInformation", "userInformation"]),
    ...mapGetters(["getIsAdmin", "getDropdownTeamMembers"]),
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("toggleDisplay", false);
      }
    },
    boardData() {
      let task = this.createTaskInformation;
      return {
        index: task.boardIndex,
        ...task.boardData
      };
    },
    createTaskForm() {
      let createTaskForm = [
        {
          "component-type": "text",
          placeholder: "Task name",
          model: "name"
        },
        {
          "component-type": "text",
          placeholder: "Task description",
          textarea: true,
          model: "description"
        },

        {
          "component-type": "date-picker",
          "input-type": "date",
          placeholder: "Select a due date",
          model: "dueDate",
          optional: true
        }
      ];

      if (this.getIsAdmin) {
        createTaskForm.splice(2, 0, {
          "component-type": "select",
          options: this.getDropDownTeamMembers,
          placeholder: "Assign task to team member",
          model: "assigned_to",
          optional: true,
          hint:
            "If this is not assigned to someone this will be done for yourself"
        });
      }
      return createTaskForm;
    }
  },
  methods: {
    ...mapActions("Admin", ["createTask"]),
    createAction(taskInformation) {
      taskInformation = Object.assign(
        { assigned_to: [this.userInformation._id] },
        taskInformation
      );
      this.createTask({
        requestBody: {
          ...taskInformation,
          boardID: this.boardData._id
        },
        mutationData: {
          ...taskInformation,
          state: 0,
          complete_date: null,
          labels: [],
          comments: [],
          date_created: new Date().toISOString(),
          boardIndex: this.boardData.index
        }
      })

        .then(() => {
          this.view = false;
        })
        .catch(() => {
          this.view = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.form_container {
  padding: 20px;
}
</style>
