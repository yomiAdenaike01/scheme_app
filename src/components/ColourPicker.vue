<template>
  <div
    :class="['colour_unit shadow', { with_details: displayDetails }]"
    :style="{ backgroundColor: colour }"
  >
    <el-color-picker
      v-model="colour"
      :predefine="colours"
      class="inner_picker"
    ></el-color-picker>

    <p v-if="displayDetails" class="details_container grey">
      {{ colour ? colour : "#fff" }}
    </p>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "ColourPicker",
  props: {
    displayDetails: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      colour: ""
    };
  },
  computed: {
    ...mapState(["colours"])
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
  border-radius: 20%;
  height: 60px;
  width: 60px;
  &.with_details {
    display: flex;
    align-items: center;
  }
}
.inner_picker {
  opacity: 0;
}
.details_container {
  border-radius: 5px;
  background: whitesmoke;
  margin-left: 40px;
  padding: 10px 20px;
}
</style>
