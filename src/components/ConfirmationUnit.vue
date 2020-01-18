<template>
  <transition name="el-fade-in">
    <div
      v-if="condition"
      class="confirmation_unit_wrapper flex align-center"
      :style="{backgroundColor:getCompanyColours}"
    >
      <i class="el-icon-check condition_indicator mr-4"></i>
      <p class="information_text_container">{{confirmationText}}</p>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "ConfirmationUnit",
  props: {
    confirmationText: {
      type: String,
      default: "Condition met"
    },
    condition: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["getCompanyColours"])
  }
};
</script>

<style lang="scss" scoped>
.confirmation_unit_wrapper {
  max-width: 40%;
  padding: 1em;
  max-height: 10%;
  border-radius: 10px;
  box-shadow: $box_shadow;
  color: white;
}
.condition_indicator {
  font-size: 1.5em;
}
.information_text_container {
  max-width: 200px;
}
</style>