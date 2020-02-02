<template>
  <el-row :type="$mq == 'lg' ? 'flex' : null" class="h-100 p-3">
    <StatsView />

    <Shifts />

    <TeamView />
  </el-row>
</template>

<script>
import Shifts from "./components/Shifts";
import TeamView from "../Team/TeamView";
import StatsView from "../Stats/StatsView";
export default {
  
  name: "Dashboard",
  activated(){

  },
  deactivated(){

  },
  computed:{
  },
  components: {
    TeamView,
    Shifts,
    StatsView
  }
};
/**
 * Google calendar intergration
 * Location tracking (late for shift or not)
 */
</script>
