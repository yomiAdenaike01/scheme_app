<template>
  <el-drawer :visible.sync="view">
    <div class="task_drawer_container">
      <div class="task_drawer_header">
        <h1 class="task_drawer_title">
          <strong>{{ taskInformation.title }}</strong>
        </h1>
        <span class="grey">{{ taskInformation.description }}</span>
        <small>found in {{ boardName }}</small>
      </div>
      <div class="information_wrapper">
        <Labels
          mode="board"
          :labels="taskInformation.labels"
          @update="update"
        />
        <div class=""></div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
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
    ...mapState("Admin", ["boards"]),
    ...mapGetters("Admin", ["getUserInformation", "getGroupName"]),
    boardName() {
      return this.boards.find(board => {
        return board._id == this.taskInformation.boardID;
      })?.name;
    },
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
.task_drawer_container {
  display: flex;
  flex: 1;
  flex-direction: column;
}
.task_drawer_header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgb(250, 250, 250);
  padding: 20px;
  line-height: 2em;
}
.task_drawer_title {
  font-size: 1.6em;
  text-transform: capitalize;
  padding: 0;
  margin: 0;
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
  display: flex;
  align-items: center;
  flex: 1;
}
</style>
