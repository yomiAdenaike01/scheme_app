<template>
  <div class="task_container" :class="{ disabled: !isAssignedTo }">
    <p>Task</p>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "Task",
  components: {
    Form: () => import("@/components/Form")
  },
  props: {
    taskInformation: {
      type: Object,
      required: true
    },
    taskIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      loading: false
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapGetters(["getIsAdmin"]),
    isAssignedTo() {
      return (
        this.taskInformation.assignedTo.indexOf(this.userInformation._id) >
          -1 || this.getIsAdmin
      );
    }
  },
  methods: {
    ...mapActions(["request"]),
    createTask(content) {
      this.loading = true;
      this.request({
        method: "POST",
        url: "tasks/create",
        data: { content }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    updateTask(update) {
      this.loading = true;
      this.request({
        method: "PUT",
        url: "tasks/update",
        data: { _id: this.taskInformation._id, update }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteTask() {
      this.loading = true;
      this.request({
        method: "DELETE",
        url: "tasks/delete",
        data: { _id: this.taskInformation._id }
      })
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.task_container {
  display: flex;
  flex: 1;
  max-width: 80%;
  max-height: 150px;
  text-overflow: ellipsis;
  box-shadow: $box_shadow;
}
</style>
