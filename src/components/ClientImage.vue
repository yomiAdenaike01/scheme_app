<template>
  <div :class="['image_wrapper mt-4 mb-4', { flex_center: center }]">
    <img
      :src="client.company_image"
      v-if="isValid"
      :alt="client.company_name"
    />
    <div v-else class="pending_image" v-loading="true"></div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "ClientImage",
  props: {
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(["client"]),
    isValid() {
      return Object.keys(this.client).length > 0;
    }
  }
};
</script>

<style lang="scss" scoped>
.image_wrapper {
  &.flex_center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
img {
  max-width: 30%;
  max-height: 30%;
}
.pending_image {
  height: 100px;
  width: 100px;
}
</style>
