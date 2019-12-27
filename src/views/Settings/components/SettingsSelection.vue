<template>
  <el-radio-group v-model="preferences">
    <el-radio-button label="General"></el-radio-button>
    <el-radio-button label="Security"></el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: "PreferencesSelection",
  data() {
    return {
      preferences: "Security"
    };
  },
  watch: {
    preferences(val) {
      this.$emit("prefChange", val);
    }
  }
};
</script>

