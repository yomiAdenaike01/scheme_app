<template>
  <el-row type="flex" style="border-bottom: solid 1px #e6e6e6;" justify="end" align="middle">
    <el-col :span="3" style="background:#2f74eb; color:white">
      <h4 class="light p-3">Dock Pharmacy</h4>
    </el-col>
    <el-col>
      <div class="profile_container">
        <el-avatar icon="el-user-solid"></el-avatar>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "UserInfoBar"
};
</script>

