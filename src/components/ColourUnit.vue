<template functional>
  <div class="colour_unit p-3 m-2" :style="{backgroundColor:props.colour}"></div>
</template>
<script>
export default {
  name: "ColourUnit",
  props: {
    colour: {
      type: String,
      default: "red"
    }
  }
};
</script>

<style lang="scss" scoped>
.colour_unit {
  border-radius: 50%;
  box-shadow: $box_shadow;
}
</style>