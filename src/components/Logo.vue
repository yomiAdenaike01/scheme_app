<template functional>
  <div class="logo_wrapper flex_center">
    <h1 class="logo flex_center">{{ props.label }}</h1>
  </div>
</template>

<script>
export default {
  name: "Logo",
  props: {
    label: {
      type: String,
      default: "S"
    }
  }
};
</script>

<style lang="scss" scoped>
.logo {
  margin: 0;
}
</style>
