<template>
  <div :class="['image_wrapper ', { flex_center: center }]">
    <transition name="el-fade-in">
      <el-image v-if="getClient" :src="getClient.company_image" fit="cover"></el-image>
      <el-image v-else class="error_image">
        <div slot="error" class="error_image_slot">
          <i class="el-icon-user"></i>
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
  .el-image {
    max-height: 100px;
    max-width: 100px;
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
.el-icon-user {
  font-size: 2em;
  color: #999;
}
</style>
