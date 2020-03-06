<template>
  <div :class="['image_wrapper', { flex_center: center }]">
    <transition name="el-fade-in">
      <el-image
        v-if="getClient || image"
        :src="showClient ? getClient.image : image"
        fit="cover"
      >
        <div slot="error" class="error_image_slot">
          <FullLogo />
        </div>
      </el-image>
    </transition>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import FullLogo from "./FullLogo";
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
    icon: {
      type: String,
      default: "el-icon-office-building"
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
  },
  components: {
    FullLogo
  }
};
</script>

<style lang="scss" scoped>
.image_wrapper {
  .el-image {
    max-width: 300px;
  }
}
.flex_center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.error_icon {
  font-size: 2em;
  color: #999;
}
</style>
