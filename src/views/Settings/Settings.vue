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
            <SecuritySettings active />
          </el-col>
          <el-col v-else-if="settingsView =='general'">
            <GeneralSettings />
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="settings_footer">
        <el-button
          @click="update"
          v-loading="loading"
          v-if="settingsUpdated"
          size="small"
        >Save Settings</el-button>
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Title from "@/components/Title";
import SettingsSelection from "./components/SettingsSelection";
import SecuritySettings from "./components/SecuritySettings";
import GeneralSettings from "./components/GeneralSettings";

export default {
  name: "Settings",
  data() {
    return {
      view: "general",
      settingsUpdated: false,
      loading: false
    };
  },

  props: {
    display: Boolean
  },
  computed: {
    ...mapState(["currentUser", "localSettings"]),
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
  methods: {
    ...mapActions(["updateSettings"]),
    update() {
      this.updateSettings()
        .then(response => (this.loading = false))
        .catch(err => (this.loading = false));

      this.$forceUpdate();
    }
  },
  components: {
    Title,
    SettingsSelection,
    SecuritySettings,
    GeneralSettings
  },
  watch: {
    localSettings: {
      deep: true,
      handler(val) {
        this.settingsUpdated = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.el-col {
  margin-top: 2em;
}
.settings_footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>