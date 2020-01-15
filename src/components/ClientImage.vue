<template>
  <div :class="['image_wrapper ', { flex_center: center }]">
    <transition name="el-fade-in">
      <el-image
        v-if="image || getClient"
        :src="showClient ? getClient.company_image : image"
        fit="cover"
      >
        <div slot="error" class="error_image_slot">
          <i class="el-icon-user"></i>
        </div>
      </el-image>
      <!-- Display icon if there is no image -->
      <el-image v-else>
        <div slot="error" class="error_image_slot">
          <i class="error_icon el-icon-office-building"></i>
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
    showClient: {
      type: Boolean,
      default: true
    },
    image: {
      type: String
    },
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
.error_icon {
  font-size: 2em;
  color: #999;
}
</style>
