<template>
  <div class="themes_container">
    <div v-for="(value, key) in theme" :key="key" class="theme_container">
      <span class="theme_name">{{
        makePretty(key.replace("colour", ""))
      }}</span>
      <el-popover trigger="click">
        <div
          slot="reference"
          class="theme_unit trigger"
          :style="{ backgroundColor: `rgba(${value}, 1)` }"
        ></div>
        <Sketch
          :value="`rgba(${value},1)`"
          :preset-colours="colours"
          @input="updateTheme(key, $event)"
        />
      </el-popover>
    </div>
  </div>
</template>

<script>
import { Sketch } from "vue-color";
import { mapState } from "vuex";

export default {
  name: "Themes",
  components: {
    Sketch
  },
  data() {
    return {
      theme: {}
    };
  },
  computed: {
    ...mapState(["colours"])
  },
  created() {
    this.genTheme();
  },

  methods: {
    updateTheme(key, value) {
      let root = document.documentElement;

      let values = value.rgba;
      let rgbaColours = `${values.r},${values.g},${values.b}`;
      this.$set(this.theme, key, rgbaColours);
      root.style.setProperty(`--${key}`, rgbaColours);
      this.$emit("updateTheme", { theme: this.theme });
    },
    genTheme() {
      let baseStyle = getComputedStyle(document.body);

      const getStyle = cssVar => {
        return baseStyle.getPropertyValue(cssVar);
      };
      let themeVars = ["colour_primary", "colour_secondary"];

      for (let i = 0, len = themeVars.length; i < len; i++) {
        let themeItem = `--${themeVars[i]}`;
        this.$set(this.theme, themeVars[i], getStyle(themeItem));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.themes_container {
  display: flex;
  flex-wrap: wrap;
  flex: 1;
}
.theme_container {
  flex: 1;
  margin: 30px;
}
.theme_unit {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 5px;
  flex: 1;
  min-height: 70px;
}
.theme_name {
  text-transform: uppercase;
}
</style>
