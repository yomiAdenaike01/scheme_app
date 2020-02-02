<template functional>
  <div class="colour_unit" :style="{backgroundColor:props.colour}"></div>
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
  width: 50px;
  height:50px;
}
</style>