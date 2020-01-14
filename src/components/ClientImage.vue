<template>
  <div :class="['image_wrapper mt-4 mb-4', { flex_center: center }]">
    <transition name="el-fade-in">
      <img
        v-loading="true"
        v-if="getClient"
        :src="getClient.company_image"
        @load="imagePresent = true"
      />
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "ClientImage",
  data() {
    return {
      imageLoading: true,
      imagePresent: false
    };
  },
  props: {
    center: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(["getClient"])
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
