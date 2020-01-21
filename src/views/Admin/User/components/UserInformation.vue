<template>
  <el-col class="shadow p-4 current_user_column mr-4">
    <header class="flex_center columns">
      <Avatar :name="currentUser.name" />
      <strong>{{currentUser.name}}</strong>
      <span class="mb-4">{{currentUser.employee_type}}</span>
      <span>{{currentUser.email}}</span>
    </header>
    <el-divider></el-divider>
    <Tabs
      v-model.number="changeTabs"
      :tabs="renderTabs"
      :disable="true"
      position="right"
      class="w-100"
    />
    {{currentUser}}
  </el-col>
</template>

<script>
import { mapState } from "vuex";
import Tabs from "@/components/Tabs";
import Avatar from "@/components/Avatar";
export default {
  name: "UserInformation",
  data() {
    return {
      tabs: 0
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    changeTabs: {
      get() {
        return;
      },
      set(val) {
        this.$emit("input", val);
      }
    },
    renderTabs() {
      return [
        {
          label: "Team Members",
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
.current_user_column {
  width: 100%;
  .el-tabs__item {
    width: 100%;
  }
}
</style>