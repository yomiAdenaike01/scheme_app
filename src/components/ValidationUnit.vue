<template>
  <div class="validation_wrapper">
    <el-tag
      style="width:100%; text-align:center"
      class="validation_unit"
      :type="booleanController"
      effect="plain"
    >{{this[booleanController]['text'] }}</el-tag>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ValidationUnit",

  props: {
    text: {
      type: String
    },

    success: {
      type: Object
    },
    danger: {
      type: Object
    },
    info: {
      type: Object
    }
  },
  computed: {
    booleanController() {
      return this.success.condition
        ? "success"
        : this.danger.condition
        ? "danger"
        : this.info.condition
        ? "info"
        : "info";
    }
  }
};
</script>
<style lang="scss" scoped>
.validation_unit {
  box-shadow: $box_shadow;
}
</style>