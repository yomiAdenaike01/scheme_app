<template>
  <el-row type="flex" class="user_container p-4">
    <UserInformation class="ml-4" v-model.number="currentTab" />
    <el-col class="p-4 shadow" v-if="currentTab == 0">
      <UserTeamMember v-for="member in team" :key="member._id" :data="member" />
    </el-col>
    <el-col class="p-4 shadow" v-else-if="currentTab == 1">
      <p>Hello</p>
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
      currentTab: 0
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    ...mapState("Admin", ["team"])
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