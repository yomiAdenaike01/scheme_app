<template>
  <div class="company_personlisation_container">
    <div v-if="client">
      <span class="desc">{{personalisationText}}</span>
    </div>
    <ThemeSelection :colours="predefinedColours">
      <!-- Display a row for the sidebar and the other colours -->
      <ColourUnit :colour="colour" v-for="colour in predefinedColours" :key="colour" />
    </ThemeSelection>
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
    predefinedColours: Array | String
  },
  computed: {
    ...mapState(["client"]),
    hasCompanyImage() {
      return this.client.hasOwnProperty("company_image");
    },
    hasCompanyColorus() {
      return this.client.hasOwnProperty("company_colours");
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