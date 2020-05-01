<template>
  <el-col class="shadow p-4 current_user_column mr-4">
    <header class="flex_center columns">
      <Avatar :name="currentUser.name" />
      <strong>{{ currentUser.name }}</strong>
      <small>{{ getEmployeeTypeLabel }}</small>
      <span>{{ currentUser.email }}</span>
    </header>
    <el-divider></el-divider>
    <Tabs
      v-model.number="currentView"
      tab-type="card"
      :tabs="renderTabs"
      :disable="true"
      class="w-100"
    />
    <div v-if="currentView == 0">{{ currentUser }}</div>
  </el-col>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import Tabs from "@/components/Tabs";
import Avatar from "@/components/Avatar";

export default {
  name: "UserInformation",
  data() {
    return {
      tabs: 0,
      currentView: ""
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    ...mapGetters(["getEmployeeTypeLabel"]),

    renderTabs() {
      return [
        {
          renderTitle: "<i class='el-icon-user'></i>",
          view: {
            component: ""
          }
        },
        {
          label: "Tab",
          view: {
            component: ""
          }
        }
      ];
    }
  },
  components: {
    Tabs,
    Avatar
  }
};
</script>
<style lang="scss" scoped>
header {
  line-height: 1.5em;
}
.current_user_column {
  width: 100%;
  .el-tabs__item {
    width: 100%;
  }
}
</style>
