<template>
  <Overlay :display="display" @close="$emit('toggleDisplay')">
    <div v-loading="loading" class="create_task_container">
      <div class="text_container all_centre">
        <h2>
          Create task for <strong>{{ boardData.name }}</strong>
        </h2>
        <p>Fill in the form below to create a new task</p>
      </div>
      <Form
        :config="createTaskForm"
        submit-text="Create task"
        @val="createAction"
      />
    </div>
  </Overlay>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import Overlay from "@/components/Overlay";
import Form from "@/components/Form";

export default {
  name: "TaskOverlay",
  components: {
    Overlay,
    Form
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
    ...mapActions("Tasks", ["createTask"]),
    createAction(taskInformation) {
      taskInformation = Object.assign(taskInformation, {
        assigned_to: [this.userInformation._id]
      });
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

<style lang="scss" scoped></style>
