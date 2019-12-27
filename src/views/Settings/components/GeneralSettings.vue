<template>
  <div>
    <el-form v-model="generalSettings">
      <el-form-item
        class="toggle_item p-2"
        v-for="(setting,index) in settingsConfig"
        :label="setting.name"
        v-model="generalSettings[setting.model]"
        :key="index"
      >
        <el-switch></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "GeneralSettings",
  data() {
    return {
      generalSettings: {}
    };
  },
  computed: {
    settingsConfig() {
      return [
        {
          name: "Live Schedule",
          type: "toggle",
          model: "live_schedule"
        },
        {
          name: "Live Dashboard",
          type: "toggle",
          model: "live_dashboard"
        }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle_item {
  background: rgb(250, 250, 250);
}
</style>