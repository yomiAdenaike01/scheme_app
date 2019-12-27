<template>
  <div>
    <el-form v-model="generalSettings">
      <el-form-item
        class="toggle_item p-2"
        v-for="(setting,index) in settingsConfig"
        :label="setting.name"
        :key="index"
      >
        <el-switch v-model="generalSettings[setting.model]"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "GeneralSettings",
  data() {
    return {
      generalSettings: {}
    };
  },
  computed: {
    ...mapState(["localSettings"]),
    settingsConfig() {
      let settings = this.localSettings.general;
      let settingsArr = [];
      for (let property in settings) {
        let settingsObj = {
          name: property.replace("_", " "),
          type: "toggle",
          model: property
        };
        settingsArr.push(settingsObj);
      }
      return settingsArr;
    }
  },
  methods: {
    ...mapMutations(["UPDATE_SETTINGS"])
  },
  watch: {
    generalSettings(val) {
      for (let property in val) {
        this.UPDATE_SETTINGS({
          category: "general",
          key: property,
          value: val[property]
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.toggle_item {
  background: rgb(250, 250, 250);
  text-transform: capitalize;
}
</style>