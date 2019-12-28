<template>
  <el-collapse v-model="activeName" accordion class="mt-3">
    <el-collapse-item name="1">
      <template slot="title">
        <div
          style="width:90%;display:flex;justify-content:space-between;align-items:center;"
        >
          Change Email Address
          <span style="color:#999">{{ currentUser.email }}</span>
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
  </el-collapse>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'UserDetailsPreferences',
  data() {
    return {
      activeName: ''
    }
  },
  computed: {
    ...mapState(['currentUser']),
    currentUserConfig() {
      for (let prop in this.currentUser) {
      }
    }
  },
  methods: {
    ...mapActions(['request']),
    changePassword() {
      this.request({
        method: 'POST',
        url: 'users/forgotpassword',
        data: { password: this.password }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
</style>
