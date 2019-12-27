<template>
  <el-collapse v-model="activeName" accordion class="mt-3">
    <el-collapse-item name="1">
      <template slot="title">
        <div style="width:90%;display:flex;justify-content:space-between;align-items:center;">
          Change Login Details
          <span style="color:#999">{{currentUser.email}}</span>
        </div>
      </template>
      <el-input placeholder="Enter new email address" />
      <p>Or change password</p>
      <el-input placeholder="Enter new password" />
      <el-input placeholder="Verify new password" />

      <br />
    </el-collapse-item>
    <el-collapse-item title="Feedback" name="2">
      <div>Operation feedback: enable the users to clearly perceive their operations by style updates and interactive effects;</div>
      <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
    </el-collapse-item>
    <el-collapse-item title="Efficiency" name="3">
      <div>Simplify the process: keep operating process simple and intuitive;</div>
      <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make decisions;</div>
      <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees them from memorizing and recalling.</div>
    </el-collapse-item>
    <el-collapse-item title="Controllability" name="4">
      <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the users;</div>
      <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting or terminating current operation.</div>
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

