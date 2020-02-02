<template>
  <div class="h-100">
    <el-row :type="$mq == 'lg' ? 'flex' : null" class="h-100 pl-4">
      <Shifts />
      <Utils />
      <TeamView />
    </el-row>
  </div>
</template>

<script>
import Shifts from "./components/Shifts";
import TeamView from "../Team/TeamView";
import Utils from "./components/Utils";
export default {
  name: "Dashboard",
  activated() {},
  deactivated() {},
  computed: {},
  components: {
    TeamView,
    Shifts,
    Utils
  }
};
/**
 * Google calendar intergration
 * Location tracking (late for shift or not)
 */
</script>
