<template>
  <el-row type="flex" class="user_container p-4">
    <UserInformation class="ml-4" />
    <Group v-if="team.length > 0">
      <el-col>
        <UserTeamMember v-for="member in team" :key="member._id" :data="member" />
      </el-col>
    </Group>
    <Group addNew @createUser="createEmployee = $event" />
    <CreateEmployee :display="createEmployee" @toggle="createEmployee = $event" />
  </el-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
import UserTeamMember from "./components/UserTeamMember";
import UserInformation from "./components/UserInformation";
import CreateEmployee from "./components/CreateEmployee";

import Group from "./components/Group";
export default {
  name: "User",
  data() {
    return {
      createEmployee: false
    };
  },
  computed: {
    ...mapState(["userInformation", "clientInformation"]),
    ...mapState("Admin", ["team", "groupIDs"]),
    groupsWithUsers() {
      let { userGroups } = this.clientInformation;
      let _userGroups = [...userGroups];

      const len = _userGroups.length;
      for (let i = 0; i < len; i++) {
        _userGroups = {
          ..._userGroups[i],
          teamMembers: []
        };
        let { name, value, teamMembers } = _userGroups[i];
        let groupMember = this.team.find(member => {
          return member.groupID == value;
        });

        if (groupMember) {
          let { _id, name } = groupMember;
          teamMembers.push({ id: _id, name });
        }
      }

      return _userGroups;
    },

    tableTeam() {
      let team = [...this.team];
      return team.map(member => {
        let { groupID } = member;
        return {
          ...member,
          groupID: this.groupIDs[groupID].name
        };
      });
    }
  },
  components: {
    UserInformation,
    UserTeamMember,
    Group,
    CreateEmployee
  }
};
</script>

<style lang="scss" scoped>
.user_container {
  font-size: 0.9em;
  height: 50%;
}
.current_user_column {
  max-width: 30%;
}
</style>
