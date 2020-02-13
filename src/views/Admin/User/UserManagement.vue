<template>
  
  <el-row type="flex" class="user_container p-4" v-loading="loading">
    
    <Group addNew @createUser="createEmployee = $event" />

    <Group v-if="team.length > 0">
      <el-row v-for="count in filteredGroupsWithUsers.length" :key="count" type="flex">
        <el-col class="bordered m-2 p-2" v-for="(group, index) in groupsWithUsers" :key="index">
          <div class="title_container">
            <el-button class="large_icon no_events borderless" icon="el-icon-user"></el-button>
            {{group.name}}
          </div>
          <UserTeamMember
            v-for="member in group.teamMembers"
            :data="{ ...member, groupID: group.value }"
            :key="member._id"
          />
        </el-col>
      </el-row>
    </Group>

    <CreateEmployee :display="createEmployee" @toggle="createEmployee = $event" />
  </el-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserTeamMember from "./components/UserTeamMember";
import UserInformation from "./components/UserInformation";
import CreateEmployee from "./components/CreateEmployee";
import Draggable from "vuedraggable";
import Group from "./components/Group";
export default {
  name: "UserManagement",
  activated() {
    this.getTeam()
      .then(() => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },
  data() {
    return {
      createEmployee: false,
      localUserGroup: [],
      loading: true
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["team", "groupIDs"]),

    dragOptions() {
      return {
        animation: 200,
        disabled: false,
        ghostClass: "ghost"
      };
    },
filteredGroupsWithUsers(){
  let groups = this.groupsWithUsers;
  for(let i = 0, len = groups.length; i  < len; i++){
    let group = groups[i];
    if("teamMember" in group){
      if(group.teamMembers.length == 0){
        groups.splice(i,1);
      }
    }
  }
  return groups;
},
    groupsWithUsers() {
      let {userGroups} = {...this.clientInformation};
      let userGroupArr = [];

      for(let i = 0, len = this.team.length; i < len; i++){
        
        let member = this.team[i];
        let userGroup = {...userGroups[i],teamMembers:[]};
        let {value} = userGroup;


        if(value == member.groupID){
          userGroup.teamMembers.push(member);
         userGroupArr.push(userGroup);
        }


      }
      return userGroupArr;
  }
  },
  methods: {
    ...mapActions("Admin", ["getTeam"]),
    logChanges(e) {
      console.log(e);
    }
  },
  components: {
    UserInformation,
    UserTeamMember,
    Group,
    CreateEmployee,
    Draggable
  },
  watch: {
    localUserGroup(val) {
      console.log(val);
    }
  }
  }

</script>

<style lang="scss" scoped>
.user_container {
  font-size: 0.9em;
  height: 90%;
}
.current_user_column {
  max-width: 30%;
}
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.user_group_container {
  border: 2px solid whitesmoke;
}
</style>
