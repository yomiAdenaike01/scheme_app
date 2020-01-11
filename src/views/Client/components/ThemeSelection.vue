<template>
  <div class="container">
    <el-popover placement="left" trigger="hover">
      <div
        slot="reference"
        class="theme_selection_unit"
        :style="{ backgroundColor: this.colour }"
      ></div>
      <chrome-picker v-model="colours" />
    </el-popover>
    <span class="theme_selection_label">{{ label }}</span>
  </div>
</template>

<script>
import { Chrome } from "vue-color";

export default {
  name: "ThemeSelectionUnit",
  data() {
    return {
      displayPicker: false
    };
  },
  props: {
    colour: {
      type: String | undefined | null,
      required: true
    },
    label: {
      type: String,
      default: "Colour"
    },
    index: {
      type: Number
    }
  },
  computed: {
    colours: {
      get() {
        return this.colour;
      },
      set(val) {
        this.$emit("input", val.hex);
      }
    }
  },
  components: {
    "chrome-picker": Chrome
  }
};
</script>

<style lang="scss" scoped>
.vc-chrome {
  box-shadow: none;
}
.container {
  display: flex;
  align-items: center;
}
.theme_selection_unit {
  padding: 2em 3em;
  border-radius: 50%;
  flex: 1;
  min-height: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.theme_selection_label {
  font-size: 0.8em;
}
</style>
