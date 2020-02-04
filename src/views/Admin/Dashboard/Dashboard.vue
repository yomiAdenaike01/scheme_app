<template>
  <div class="h-100">
    <el-row class="h-100">
      <el-row :type="$mq == 'lg' ? 'flex' : null" class="h-100 pl-2">
        <Shifts />
        <Widgets />
        <TeamView />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Shifts from "./components/Shifts";
import TeamView from "../Team/TeamView";
import Widgets from "./components/Widgets/Widgets";
import { mapActions } from "vuex";
export default {
  name: "Dashboard",
  activated() {
    this.getTasks();
    this.getNotes();
  },
  methods: {
    ...mapActions("Admin", ["getNotes", "getTasks"])
  },
  components: {
    TeamView,
    Shifts,
    Widgets
  }
};
/**
 * Google calendar intergration
 * Location tracking (late for shift or not)
 */
</script>
