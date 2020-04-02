<template>
  <div class="task_container" :class="{ disabled: !isAssignedTo, populated:!isNew }">
    <div class="task_inner_container" :class="{ is_new: isNew }">
      <div v-if="isNew" class="new_task_container" @click="$emit('createTask')">
        <span> <i class="bx bx-plus"></i> Create new task</span>
      </div>

      <!-- Populated task -->
      <div v-else class="populated_task_container">
        <p>
        <h3>{{ taskInformation.title }}</h3>
        <small class="grey">{{ taskInformation.description }}</small>
        <el-tag v-if="taskInformation.dueDate">{{
          formatDate(taskInformation.dueDate)
        }}</el-tag>
        </p>
        <div
          v-if="taskInformation.assignedTo.indexOf(userInformation._id) == -1"
        >
          <el-tag
            v-for="teamMember in taskInformation.assignedTo"
            :key="teamMember"
            >{{ getUserInformation(teamMember) }}</el-tag
          >
        </div>
        <Popover trigger='click'>
        <el-button
        slot="trigger"
          class="complete_indication"
          round
          size="mini"
          v-bind="buttonConfig"
          >{{
            buttonConfig.text
          }}</el-button
        >
        <Form slot="content" disable emit-on-change class="full_width" :config="updateTaskStateConfig" @change="updateTask"/>
        </Popover>
<transition name="el-fade-in">
        <div v-if="currState != 'complete'" class="completed_overlay">
          <el-button class="complete_button" circle icon="el-icon-check" type="success"/>
          <el-button size="mini" type='text'>Undo complete</el-button>
        </div>
</transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: "TaskItem",
  components: {
    Form: () => import("@/components/Form"),
    Popover: ()=>import("@/components/Popover")
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
    ...mapGetters("Admin", ["getUserInformation"]),
    currState(){
      return this.stateOptionsXref[this.taskInformation.state].toLowerCase();
    },
    stateOptions(){
      let options = [{label:'Complete',value:1},{label:'Incomplete',value:0},{label:'Deferred',value:2}];
      return options.filter(option=>{
        return option.value != this.taskInformation.state
      });
    },
    stateOptionsXref(){
      return [
        'Incomplete',
        'Complete',
        'Deferred'
      ]
    },
    updateTaskStateConfig(){
      return [
        {
          'component-type':'select',
          options:this.stateOptions,
          placeholder:'Change task state',
          model:'state'
        }
      ]
    },
    buttonConfig(){
      let buttonConfig = {
        text:this.stateOptionsXref[this.taskInformation.state]
      };

      switch (this.taskInformation.state) {

        case 0:{
          buttonConfig.round = true,
          buttonConfig.type = 'info'
          break;
        }

        case 1:{
          buttonConfig.circle = true;
          buttonConfig.round = false;
          buttonConfig.icon='el-icon-check';
          buttonConfig.type = 'success';
          break;
        }

        case 2:{
          buttonConfig.round = true;
          buttonConfig.circle = false;
          buttonConfig.type = 'warning';
          break;
        }
      
        default:{
          break;
        }
      }
      return buttonConfig;
    },
    isAssignedTo() {
      return (
        this.taskInformation?.assignedTo?.indexOf(this.userInformation._id) >
          -1 || this.getIsAdmin
      );
    }
  },
  methods: {
    ...mapActions(["request"]),

    updateTask(update) {
      return console.log(update);
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
  text-overflow: ellipsis;
  position: relative;

  &.populated{
    background:white;
    box-shadow: 1px 2px 6px rgb(230,230,230);
  margin: 30px 0;
  border-radius: 10px;

  }

}
.task_inner_container {
  display:flex;
  flex-direction: column;
  flex: 1;
  border-radius: 10px;
  max-height: 300px;
  &.is_new {
    font-size: 1.1em;
    color: #ccc;
    cursor: pointer;
    max-height: 20px;
    padding: 0;
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
.populated_task_container {
  padding:20px;
  flex:1;
  position: relative;
  h3 {
    text-transform: capitalize;
    padding: 0;
    margin: 0;
  }
}
.completed_overlay{
  position: absolute;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  top:0;
  left:0;
  right:0;
  bottom:0;
  background:rgba(250, 250, 250,0.9)
}
.complete_button{
  margin-bottom: 20px;
  pointer-events: none;
}
.mark_as_complete {
  border-radius: 50%;
}
.complete_indication {
  text-transform: capitalize;
}
</style>
