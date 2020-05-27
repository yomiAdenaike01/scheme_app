<template>
  <div class="preferences_container">
    <div class="selection_container">
      <div
        v-for="(config, index) in preferencesConfig"
        :key="index"
        class="selection_item trigger"
        :class="{ active: config == preference }"
        @click="setPreference(config)"
      >
        <h3>{{ config }}</h3>
      </div>
    </div>
    <div class="viewing_container">
      <Themes v-if="preference == 'themes'" @updateTheme="updatePreferences" />
    </div>
  </div>
</template>

<script>
import Themes from "./components/Themes";
import { mapState, mapMutations } from "vuex";
export default {
  name: "Preferences",
  components: {
    Themes
  },
  data() {
    return {
      preference: ""
    };
  },
  computed: {
    ...mapState(["userInformation"]),
    preferencesConfig() {
      let user = this.userInformation;
      let preferences = ["themes"];
      if (user?.preferences) {
        preferences = Object.keys(user.preferences);
      }
      return preferences;
    }
  },
  created() {
    this.setPreference(this.preferencesConfig[0]);
  },
  methods: {
    ...mapMutations(["UPDATE_USER"]),
    setPreference(preference) {
      this.preference = preference;
    },
    async updatePreferences(preference) {
      try {
        // let apiPayload = {
        //   data: preference,
        //   url: "users/preferences",
        //   method: "PUT"
        // };
        // let localPreferences = Object.assign(
        //   {},
        //   this.userInformation.preferences,
        //   preference
        // );
        // this.UPDATE_USER({
        //   preferences: localPreferences
        // });
        // await this.request(apiPayload);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preferences_container {
  display: flex;
  flex: 1;
  background: white;
}
.selection_container {
  display: flex;
  flex-direction: column;
  flex: 0.3;
  border: $border;
}
.selection_item {
  border-bottom: $border;
  padding: 10px;
  display: flex;
  text-transform: capitalize;
  opacity: 0.2;
  &.active,
  &:hover {
    opacity: 1;
  }
}
.viewing_container {
  display: flex;
  flex: 1;
}
/**
        background:rgba(var(--colour_secondary),.5);
        color:rgba(var(--colour_secondary),1);
        border: 1px solid rgba(var(--colour_secondary),1);
         */
</style>
