<template>
  <div class="task_container" :class="{ disabled: !isAssignedTo }">
    <div class="task_inner_container" :class="{ is_new: isNew }">
      <div v-if="isNew" class="new_task_container" @click="createTask">
        <span> <i class="bx bx-plus"></i> Create new task</span>
      </div>
      <div v-else class="populated_task_container">
        <p>{{ taskInformation }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "TaskItem",
  components: {
    Form: () => import("@/components/Form")
  },
  props: {
    taskInformation: {
      type: Object
    },
    taskIndex: {
      type: Number,
      default: 0
    },
    isNew: {
      type: Boolean,
      default: false
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
        this.taskInformation?.assignedTo?.indexOf(this.userInformation._id) >
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
  margin: 20px 0;
  max-height: 300px;
  text-overflow: ellipsis;
}
.task_inner_container {
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 1px 1px 1px rgb(250, 250, 250);
  &.is_new {
    font-size: 1.1em;
    color: #ccc;
    cursor: pointer;
    max-height: 20px;
    transition: $default_transition;
    &:hover {
      color: #999;
      border-color: #999;
    }
  }
}
.new_task_container {
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: rgb(250, 250, 250);
  border-top: 2px solid whitesmoke;
  color: #999;
  transition: $default_transition;
}
</style>
