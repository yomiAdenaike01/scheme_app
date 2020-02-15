<template>
  <div class="icon_container" :style="{ backgroundColor: bg }">
    <i :class="icon"></i>
  </div>
</template>

<script>
export default {
  name: "LeadIcon",
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
  background-image: linear-gradient(15deg, #13547a 0%, #80d0c7 100%);
  max-width: 50px;
  text-align: center;
  border-radius: 50%;
  padding: 5px 14px;
  i {
    color: white;
  }
}
</style>
