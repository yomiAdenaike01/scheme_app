<template>
  <el-tag
    class="validation_unit"
    :type="booleanController"
    effect="dark"
  >{{self[booleanController]['text']}}</el-tag>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ValidationUnit",
  data() {
    return {
      self: this
    };
  },
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
        : "";
    }
  }
};
</script>

