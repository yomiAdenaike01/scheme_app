<template>
  <el-drawer :visible.sync="returnDisplay" direction="rtl">
    <el-container>
      <el-main>
        <el-row>
          <el-col>
            <h1>User Details</h1>
            {{currentUser}}
          </el-col>
          <el-col>
            <h1>Quick Actions</h1>
            {{quickActions}}
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserInfoDrawer",
  props: {
    display: Boolean
  },
  computed: {
    ...mapState(["currentUser"]),
    quickActions() {
      return [
        {
          name: "Create Quick Request"
        }
      ];
    },
    returnDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-col {
  margin-top: 2em;
}
</style>