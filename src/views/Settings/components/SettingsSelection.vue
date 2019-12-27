<template>
  <el-radio-group v-model="settings" size="small">
    <el-radio-button label="General"></el-radio-button>
    <el-radio-button label="Security"></el-radio-button>
  </el-radio-group>
</template>

<script>
export default {
  name: "SettingsSelection",
  props: {
    active: String
  },
  data() {
    return {
      settings: "General"
    };
  },
  watch: {
    settings(val) {
      this.$emit("prefChange", val);
    }
  }
};
</script>

