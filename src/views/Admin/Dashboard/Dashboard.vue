<template>
  <div class="h-100">
    <el-row class="h-100">
      <Todos />

      <el-row :type="$mq == 'lg' ? 'flex' : null" class="h-100 pl-2">
        <Shifts />
        <Utils />
        <TeamView />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import Shifts from "./components/Shifts";
import TeamView from "../Team/TeamView";
import Utils from "./components/Utils";
import Todos from "./components/Todos";
import { mapActions } from "vuex";
export default {
  name: "Dashboard",
  activated() {
    this.getTodos();
  },
  deactivated() {},
  computed: {},
  methods: {
    ...mapActions(["request"]),
    getTodos() {
      this.request({
        method: "GET",
        url: "todos/get"
      }).then(response => {
        console.log(response);
      });
    }
  },
  components: {
    TeamView,
    Shifts,
    Utils,
    Todos
  }
};
/**
 * Google calendar intergration
 * Location tracking (late for shift or not)
 */
</script>
