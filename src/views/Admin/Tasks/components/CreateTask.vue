<template>
  <el-dialog :visible.sync="view">
    <div class="create_task_container">
      <Form :config="crecreateate" @val="createTask" />
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "CreateTask",
  components: {
    Form: () => import("@/components/Form")
  },
  props: {
    display: {
      type: Boolean,
      default: false
    }
  },
  computed: {
      ...mapState(['clientInformation','userInformation']),
      ...mapState('Admin',['teamInformation']),
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("toggleDisplay", false);
      }
    },
    createTaskForm(){
        return [
            {
                'component-type':'select',
                options:this.teamInformation,
                placeholder:'Assign task to someone',
                model:'assignedTo'
            },
             {
                'component-type':'date-picker',
                'input-type':'date',
                options:this.teamInformation,
                placeholder:'Assign task to someone',
                model:'due date',
                optional:true
            },
        ]
    }
  },
    methods: {
      ...mapActions(["request"]),
      createTaskForm(taskInformation) {
        this.loading = true;
        this.request({
          method: "POST",
          url: "tasks/create",
          data: taskInformation
        })
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    }
  }
};
</script>

<style></style>
