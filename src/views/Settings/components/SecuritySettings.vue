<template>
  <el-collapse v-model="activeName" accordion class="mt-3">
    <el-collapse-item name="1">
      <template slot="title">
        <div style="width:90%;display:flex;justify-content:space-between;align-items:center;">
          Change Email Address
          <span style="color:#999">{{currentUser.email}}</span>
        </div>
      </template>
      <el-form>
        <el-form-item>
          <el-input placeholder="Enter new email address" />
        </el-form-item>
        <el-form-item style="display:flex; justify-content:flex-end">
          <el-button size="small">Verify</el-button>
        </el-form-item>
      </el-form>
      <br />
    </el-collapse-item>
    <el-collapse-item title="Change Password" name="2">
      <el-form>
        <el-form-item>
          <el-input placeholder="New password" type="password" show-password clearbale />
        </el-form-item>
        <el-form-item>
          <el-input placeholder="Verify new password" type="password" clearable show-password />
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "UserDetailsPreferences",
  data() {
    return {
      activeName: ""
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    currentUserConfig() {
      for (let prop in this.currentUser) {
      }
    }
  }
};
</script>

