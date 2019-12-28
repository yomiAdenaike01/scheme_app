<template>
  <el-drawer :visible.sync="returnDisplay" :direction="this.settings.drawer">
    <el-container>
      <el-main>
        <el-row>
          <Title
            defaultClass="m-0"
            title="Settings"
            subtitle="Change all aspects of your settings here."
          />
          <SettingsSelection
            @prefChange="view = $event"
            :selection="returnSettings"
          />

          <el-col v-if="settingsView == 'security'">
            <SecuritySettings active />
          </el-col>
          <el-col v-else-if="settingsView == 'general'">
            <GeneralSettings />
          </el-col>
          <el-col v-else-if="settingsView == 'profile'">
            <ProfileSettings />
          </el-col>
        </el-row>
      </el-main>
      <el-footer class="settings_footer">
        <el-button
          @click="update"
          v-loading="loading"
          v-if="settingsUpdated"
          size="small"
          >Save Settings</el-button
        >
      </el-footer>
    </el-container>
  </el-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Title from '@/components/Title'
import SettingsSelection from './components/SettingsSelection'
import SecuritySettings from './components/SecuritySettings'
import GeneralSettings from './components/GeneralSettings'
import ProfileSettings from './components/ProfileSettings'
import responsive from '@/mixins/responsiveProperties'

export default {
  name: 'Settings',
  data() {
    return {
      view: '',
      settingsUpdated: false,
      loading: false
    }
  },

  props: {
    display: Boolean
  },
  mounted() {
    this.view = this.returnSettings[0].label
  },
  computed: {
    ...mapState(['currentUser', 'localSettings']),
    returnSettings() {
      return [
        {
          label: 'General'
        },
        {
          label: 'Security'
        },
        {
          label: 'Profile'
        }
      ]
    },
    currentUserViewConfig() {
      let cUser = this.currentUser
      let arr = []
      return arr
    },
    settingsView() {
      return this.view.toLowerCase()
    },
    returnDisplay: {
      get() {
        return this.display
      },
      set(val) {
        this.$emit('toggle', val)
      }
    }
  },
  methods: {
    ...mapActions(['updateSettings']),
    update() {
      this.updateSettings()
        .then(response => (this.loading = false))
        .catch(err => (this.loading = false))

      this.$forceUpdate()
    }
  },
  components: {
    Title,
    SettingsSelection,
    SecuritySettings,
    GeneralSettings,
    ProfileSettings
  },
  mixins: [responsive],

  watch: {
    localSettings: {
      deep: true,
      handler(val) {
        this.settingsUpdated = true
      }
    }
  }
}
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
