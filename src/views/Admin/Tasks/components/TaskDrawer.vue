<template>
  <el-drawer :visible.sync="view">
    <div class="task_drawer_container">
      <h1 class="task_drawer_title">
        <strong>{{ taskInformation.title }}</strong>
      </h1>
      <span class="grey">{{ taskInformation.description }}</span>

      <div
        v-if="taskInformation.assignedTo.length > 1"
        class="multi_user_container assign_container"
      >
        <Avatar
          v-for="(user, index) in userInfo"
          :key="index"
          :name="user.name"
        />
        <p>Multiple users</p>
      </div>
      <div v-else class="single_user_container assign_container">
        <Avatar :name="userInfo[0].name" />
        <h1 class="task_drawer_title">{{ userInfo[0].name }}</h1>
      </div>
      <div class="information_container">
        <el-tag :type="taskStateXref[taskInformation.state].type">{{
          taskStateXref[taskInformation.state].label
        }}</el-tag>
        <el-tag slot="reference">{{
          taskInformation.dueDate
            ? formatDate(taskInformation.dueDate)
            : "Set due date"
        }}</el-tag>
        <Labels :labels="taskInformation.labels" />
      </div>
      {{ taskInformation }}
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "TaskDrawer",
  components: {
    Avatar: () => import("@/components/Avatar"),
    Form: () => import("@/components/Form"),
    Labels: () => import("./Labels")
  },
  props: {
    display: {
      type: Boolean,
      default: false
    },
    taskInformation: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters("Admin", ["getUserInformation", "getGroupName"]),
    dueDateConfig() {
      return [
        {
          "component-type": "date-picker",
          model: "dueDate",
          placeholder: "Due date"
        }
      ];
    },
    taskStateXref() {
      return [
        { type: "info", label: "Incomplete" },
        { type: "success", label: "Complete" },
        { type: "warning", label: "Deferred" }
      ];
    },

    userInfo() {
      return this.taskInformation?.assignedTo?.map(assignee => {
        let userInformation = this.getUserInformation(assignee);
        return {
          name: userInformation?.name ?? "Username",
          group: this.getGroupName("user", userInformation.groupID).label
        };
      });
    },
    view: {
      get() {
        return this.display;
      },
      set() {
        this.$emit("toggle", false);
      }
    }
  },
  methods: {
    ...mapActions("Admin", ["updateTask"]),
    update(update) {
      this.updateTask({ ...this.taskInformation, ...update });
    },
    setDueDate(date) {
      console.log(date);
    }
  }
};
</script>

<style lang="scss" scoped>
.task_drawer_title {
  text-transform: capitalize;
  padding: 0;
  margin: 0;
}
.task_drawer_container {
  padding: 20px;
}
.assign_container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 20px;
}
.information_container {
  border-radius: 5px;
  padding: 10px;
  border: 2px solid whitesmoke;
}
</style>
