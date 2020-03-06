<template>
  <div class="icon_container" :style="{ backgroundColor: bg }">
    <i class="lead_icon" :class="icon"></i>
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
  background: #e8175d;
  max-width: 50px;
  text-align: center;
  border-radius: 50%;
  padding: 5px 14px;
  .lead_icon {
    color: white;
  }
}
</style>
