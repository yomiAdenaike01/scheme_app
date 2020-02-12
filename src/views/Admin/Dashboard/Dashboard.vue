<template>
  <div
    class="h-100 overflow"
    v-loading="loading"
    element-loading-background="rgba(255, 255, 255, 1)"
    :element-loading-text="
      `Creating
    dashboard please wait....`
    "
  >
    <el-row class="h-100">
      <el-row :type="$mq == 'lg' ? 'flex' : null" class="h-100 pl-2">
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
import { mapActions, mapState } from "vuex";
export default {
  name: "Dashboard",
  data() {
    return {
      loading: true
    };
  },
  activated() {
    this.getTasks();
    this.getNotes();

    Promise.all([this.getTasks(), this.getNotes()])
      .then(response => {
        this.loading = false;
      })
      .catch(err => {
        this.loading = false;
      });
  },
  computed: {
    ...mapState(["userInformation"])
  },
  methods: {
    ...mapActions("Admin", ["getNotes", "getTasks"]),
    ...mapActions(["request"])
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
