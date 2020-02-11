<template>
  <div class="icon_container" :style="{backgroundColor:bg}">
    <i :class="icon"></i>
  </div>
</template>

<script>
export default {
  name: "Icon",
  props: {
    bg: {
      type: String
    },
    icon: {
      type: String
    }
  }
};
</script>
<style lang="scss" scoped>
.icon_container {
  border-radius: 50%;
  padding: 5px 14px;
  i {
    color: white;
  }
}
</style>