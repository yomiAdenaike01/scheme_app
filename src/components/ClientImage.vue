<template>
  <div :class="['image_wrapper m-2', { flex_center: center }]">
    <transition name="el-fade-in">
      <el-image v-if="getClient" :src="getClient.company_image">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
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
    },
    responsive: {
      type: Boolean,
      default: true
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
.response {
  max-width: 30%;
  max-height: 30%;
}
.pending_image {
  height: 100px;
  width: 100px;
}
</style>
