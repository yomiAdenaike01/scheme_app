<template>
  <div class="company_personlisation_container flex_center columns">
    <div v-if="clientInformation">
      <span class="desc">{{personalisationText}}</span>
    </div>
    <ThemeSelection :predefineColors="predefinedColours">
      <!-- Display a row for the sidebar and the other colours -->
      <ColourUnit :colour="colour" v-for="colour in predefinedColours" :key="colour" />
    </ThemeSelection>
    <div class="flex flex--end align-end">
      <el-button @click="method" round type="primary" size="mini">Submit</el-button>
    </div>
  </div>
</template>

<script>
import ThemeSelection from "@/components/ThemeSelection";
import Title from "@/components/Title";
import ColourUnit from "@/components/ColourUnit";
import { mapState } from "vuex";
export default {
  name: "CompanyPersonalisation",
  props: {
    definedColours: Array | String,
    predefinedColours: {
      type: Array,
      default: []
    },
    method: Function
  },
  computed: {
    ...mapState(["clientInformation", "defaultCustomColours"]),
    hasCompanyImage() {
      return this.clientInformation.hasOwnProperty("image");
    },
    hasCompanyColorus() {
      return this.clientInformation.hasOwnProperty("colours");
    },
    personalisationText() {
      return "These are your theme settings, they will update everytime you change it. This can be changed at any time. Enjoy!";
    }
  },
  components: {
    ThemeSelection,
    Title,
    ColourUnit
  }
};
</script>

<style lang="scss" scoped>
.company_personlisation_container {
  line-height: 2em;
}
</style>