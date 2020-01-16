<template>
  <div class="colour_picker_wrapper">
    <el-color-picker
      v-model="colour"
      :predefine="colours"
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
      colour: ""
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
    colour(val) {
      this.mutateTheme(val, this.syncClient);
    }
  }
};
</script>
