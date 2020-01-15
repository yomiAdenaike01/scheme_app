<template>
  <div class="colour_picker_wrapper">
    <el-color-picker
      v-model="theme"
      :predefine="colours"
      class="theme-picker"
      popper-class="theme-picker-dropdown"
      size="medium"
    />
    <div class="flex_center">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
const version = require("element-ui/package.json").version; // element-ui version from node_modules
const ORIGINAL_THEME = "#409EFF"; // default color
export default {
  name: "ThemeSelection",
  data() {
    return {
      chalk: "", // content of theme-chalk css
      theme: ""
    };
  },
  props: {
    newScheme: Boolean,
    colours: {
      type: Array,
      default: () => {
        return;
        [
          "#409EFF",
          "#1890ff",
          "#304156",
          "#212121",
          "#11a983",
          "#13c2c2",
          "#6959CD",
          "#f5222d"
        ];
      }
    }
  },
  watch: {
    async theme(val) {
      const oldVal = this.chalk ? this.theme : ORIGINAL_THEME;
      if (typeof val !== "string") return;
      const themeCluster = this.getThemeCluster(val.replace("#", ""));
      const originalCluster = this.getThemeCluster(oldVal.replace("#", ""));
      const getHandler = (variable, id) => {
        return () => {
          const originalCluster = this.getThemeCluster(
            ORIGINAL_THEME.replace("#", "")
          );
          const newStyle = this.updateStyle(
            this[variable],
            originalCluster,
            themeCluster
          );
          if (!this.newScheme) {
            this.UPDATE_THEME(newStyle);
          } else {
            this.$emit("newTheme", { style: newStyle, theme: this.theme });
          }
        };
      };
      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;
        await this.getCSSString(url, "chalk");
      }
      const chalkHandler = getHandler("chalk", "chalk-style");
      chalkHandler();
      const styles = [].slice
        .call(document.querySelectorAll("style"))
        .filter(style => {
          const text = style.innerText;
          return (
            new RegExp(oldVal, "i").test(text) && !/Chalk Variables/.test(text)
          );
        });
      styles.forEach(style => {
        const { innerText } = style;
        if (typeof innerText !== "string") return;
        style.innerText = this.updateStyle(
          innerText,
          originalCluster,
          themeCluster
        );
      });
    }
  },
  methods: {
    ...mapMutations(["UPDATE_THEME"]),

    updateStyle(style, oldCluster, newCluster) {
      let newStyle = style;
      oldCluster.forEach((color, index) => {
        newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
      });
      return newStyle;
    },
    getCSSString(url, variable) {
      return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, "");
            resolve();
          }
        };
        xhr.open("GET", url);
        xhr.send();
      });
    }
  }
};
</script>

<style>
.colour_picker_wrapper {
  text-align: center;
}
.theme-message,
.theme-picker-dropdown {
  z-index: 99999 !important;
}
.theme-picker .el-color-picker__trigger {
  width: 100px;
  height: 100px;
  margin: 30px;
}
.theme-picker-dropdown .el-color-dropdown__link-btn {
  display: none;
}
.colour_unit {
  padding: 1em;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.predefined_colours_container {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  cursor: pointer;
}
</style>
