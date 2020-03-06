<template>
  <div class="colour_picker_wrapper">
    <el-color-picker
      v-model="colour"
      show-alpha
      :predefine="colourArray"
      class="theme_picker"
    />
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters, mapActions } from "vuex";

import themeModelling from "@/mixins/alterTheme";
export default {
  name: "ThemeSelection",
  mixins: [themeModelling],
  data() {
    return {
      colour: "rgba(42, 104, 212, 1)"
    };
  },
  props: {
    syncClient: {
      type: Boolean,
      default: false
    },
    target: {
      type: String,
      default: null
    },
    newScheme: Boolean,
    predefineColors: {
      type: Array,
      default: [
        "rgba(42, 104, 212, 1)",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ]
    }
  },
  computed: {
    ...mapState(["defaultCustomColours"]),
    colourArray() {
      if (this.predefineColors.length > 0) {
        return this.predefineColors;
      } else {
        return this.defaultCustomColours;
      }
    }
  },
  watch: {
    colour(val) {
      this.mutateTheme(val, this.syncClient);
    }
  }
};
</script>
