<template>
  <el-drawer :visible.sync="returnDisplay" direction="rtl">
    <el-container>
      <el-main>
        <el-row>
          <Title
            defaultClass="m-0"
            title="Settings"
            subtitle="Change all aspects of your settings here."
          />
          <SettingsSelection @prefChange="view = $event" />

          <el-col v-if="settingsView == 'security'">
            <SecuritySettings />
          </el-col>
          <el-col v-else-if="settingsView =='general'">
            <GeneralSettings />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState } from "vuex";
import Title from "@/components/Title";
import SettingsSelection from "./components/SettingsSelection";
import SecuritySettings from "./components/SecuritySettings";
import GeneralSettings from "./components/GeneralSettings";

export default {
  name: "Settings",
  data() {
    return {
      view: "security"
    };
  },
  props: {
    display: Boolean
  },
  computed: {
    ...mapState(["currentUser"]),
    currentUserViewConfig() {
      let cUser = this.currentUser;
      let arr = [];
      return arr;
    },
    settingsView() {
      return this.view.toLowerCase();
    },
    returnDisplay: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("toggle", val);
      }
    }
  },
  components: {
    Title,
    SettingsSelection,
    SecuritySettings,
    GeneralSettings
  }
};
</script>

<style lang="scss" scoped>
.el-col {
  margin-top: 2em;
}
</style>