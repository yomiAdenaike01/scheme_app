<template>
  <el-collapse v-model="activeName" accordion class="mt-3">
    <el-collapse-item name="1" :disabled="currentUser.verified">
      <template slot="title">
        <div style="width:90%;display:flex;justify-content:space-between;align-items:center;">
          Change Email Address
          <span style="color:#999">{{ currentUser.email }}</span>
          <el-tag :type="currentUser.verified ? 'success' : 'warning'">
            {{
            currentUser.verified ? 'Activated' : 'Not Activated'
            }}
          </el-tag>
        </div>
      </template>
      <el-form>
        <el-form-item>
          <el-input placeholder="Enter new email address" size="small" />
          <el-button size="small">Verify & Change</el-button>
        </el-form-item>
      </el-form>
      <br />
    </el-collapse-item>
    <el-collapse-item title="Change Password" name="2">
      <el-form>
        <el-form-item>
          <el-input
            placeholder="New password"
            type="password"
            show-password
            clearbale
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="Verify new password"
            type="password"
            clearable
            show-password
            size="small"
          />
          <el-button size="small">Change Password</el-button>
        </el-form-item>
      </el-form>
    </el-collapse-item>
    <el-collapse-item :disabled="getIsAdmin" title="Request Admin Access">
      <el-form>
        <el-form-item style="display:flex;justify-content:center;align-items:center;">
          <el-button
            size="small"
            v-loading="loading"
            @click="requestPermissionChange"
          >Request Access</el-button>
        </el-form-item>
        <el-form-item style="text-align:center; color:#999">
          <span
            style="font-size:12px"
          >This will create a request to all admins within your organisation, any body can approve it</span>
        </el-form-item>
      </el-form>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "UserDetailsPreferences",
  data() {
    return {
      activeName: "",
      loading: false
    };
  },
  computed: {
    ...mapState(["currentUser"]),
    ...mapGetters(["getIsAdmin"]),

    currentUserConfig() {
      for (let prop in this.currentUser) {
      }
    }
  },
  methods: {
    ...mapActions(["request"]),
    requestPermissionChange() {
      this.loading = true;
      this.request({
        method: "POST",
        url: "users/update",
        data: {
          update: {
            employee_type: 1
          }
        }
      })
        .then(response => console.log(response))
        .catch(error => console.error(error));
      this.loading = false;
    },
    changePassword() {
      this.request({
        method: "POST",
        url: "users/forgotpassword",
        data: { password: this.password }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
</style>
