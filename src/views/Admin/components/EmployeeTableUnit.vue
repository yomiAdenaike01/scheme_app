<template>
  <el-row>
    <el-col :span="1">
      <el-avatar icon="el-icon-user-solid"></el-avatar>
    </el-col>
    <el-col :span="6">
      <strong class="black">{{ data.name }}</strong
      ><br />
      <span class="position">{{ data.position }}</span>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'EmployeeTableUnit',
  props: {
    data: Object
  }
}
</script>

<style lang="scss" scoped>
.position {
  font-size: 0.8em;
}
</style>
