<template>
  <div
    class="colour_unit shadow flex_center"
    :style="{ backgroundColor: colour }"
  >
    <el-color-picker
      v-model="colour"
      :predefine="defaultCustomColours"
      class="inner_picker"
    ></el-color-picker>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "ColourUnit",
  data() {
    return {
      colour: ""
    };
  },
  computed: {
    ...mapState(["defaultCustomColours"])
  },
  watch: {
    colour(val) {
      this.$emit("input", val);
    }
  }
};
</script>

<style lang="scss" scoped>
.colour_unit {
  border-radius: 50%;
  height: 60px;
  width: 60px;
}
.inner_picker {
  opacity: 0;
}
</style>
