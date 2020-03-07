<template>
  <div class="support_unit_container p-3" @click="supportData.click">
    {{ supportData.name }}
  </div>
</template>

<script>
export default {
  name: "SupportDashboardItem",
  props: {
    supportData: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
.support_unit_container {
  cursor: pointer;
  box-shadow: $box_shadow;
}
</style>
