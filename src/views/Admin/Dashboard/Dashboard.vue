<template>
  <el-row :type="$mq == 'lg' ? 'flex' : null" style="height:100%">
    <Shifts />
    <TeamView />
  </el-row>
</template>

<script>
import Shifts from "./components/Shifts";
import TeamView from "../Team/TeamView";
import NoTeamMembers from "../Team/NoTeamMembers";
export default {
  name: "Dashboard",
  components: {
    TeamView,
    Shifts,
    NoTeamMembers
  }
};
</script>
<style></style>
