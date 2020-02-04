<template>
  <el-row type="flex" class="user_container p-4">
    <UserInformation class="ml-4"  />
    <el-col class="shadow" >
 <UserTeamMember v-for="member in team" :key="member._id" :data="member"/>   
  </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserTeamMember from "./components/UserTeamMember";
import UserInformation from "./components/UserInformation";

export default {
  name: "User",
  data() {
    return {
     
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapState("Admin", ["team","employeeTypes"]),
    
    tableTeam(){
      let team = [...this.team];
      return team.map(member=>{
        let {employeeType} = member;
        return {
          ...member,
          employeeType:this.employeeTypes[employeeType].name
        }
      })
      
    }
  },
  components: {
    UserInformation,
    UserTeamMember
  }
};
</script>

<style lang="scss" scoped>
.current_user_column {
  width: 30%;
}
</style>
