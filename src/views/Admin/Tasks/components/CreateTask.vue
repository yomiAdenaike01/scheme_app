<template>
  <el-dialog :visible.sync="view">
    <div v-loading="loading" class="create_task_container">
      <InformationDisplay
        :display-text="{
          heading: `Create task for <strong>${createTaskInformation.name} board</strong>`,
          content: 'Fill in the form below to create a new task'
        }"
      />
      <div class="form_container">
        <Form
          :config="createTaskForm"
          submit-text="Create task"
          @val="create"
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
    ...mapState(["clientInformation", "userInformation"]),
    ...mapState("Admin", ["teamInformation"]),
    ...mapGetters(["getIsAdmin"]),
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("toggleDisplay", false);
      }
    },
    createTaskForm() {
      let createTaskForm = [
        {
          "component-type": "text",
          placeholder: "Task name",
          model: "title"
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
          options: this.teamInformation,
          placeholder: "Select a due date",
          model: "dueDate",
          optional: true
        }
      ];

      if (this.getIsAdmin) {
        createTaskForm.splice(2, 0, {
          "component-type": "select",
          options: this.teamInformation,
          placeholder: "Assign task to someone",
          model: "assignedTo",
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
    create(taskInformation) {
      this.loading = true;
      this.createTask({
        ...taskInformation,
        boardID: this.createTaskInformation._id
      })

        .then(() => {
          this.loading = false;
          this.view = false;
        })
        .catch(() => {
          this.loading = false;
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
