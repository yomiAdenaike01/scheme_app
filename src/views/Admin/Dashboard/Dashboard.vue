<template>
  <el-row :type="$mq == 'lg' ? 'flex' : null" style="height:100%">
    <Shifts />
    <TeamView />
    <StatsView />
  </el-row>
</template>

<script>
import Shifts from "./components/Shifts";
import TeamView from "../Team/TeamView";
import StatsView from "../Stats/StatsView";
export default {
  name: "Dashboard",
  components: {
    TeamView,
    Shifts,
    StatsView
  }
};
</script>
<style></style>
