<template>
  <div class="moreinformation_container">
    <!-- Create popover with the index of the instructions -->
    <Popover
      popperclass="p-3"
      :position="hoverPosition"
      trigger="hover"
      width="250"
      class="p-4"
    >
      <el-button slot="trigger" size="mini" plain circle :type="type"
        ><i class="bx bx-question-mark"></i
      ></el-button>

      <div slot="content" class="instructions_content">
        <h2 class="mb-2">{{ guideContent.title }}</h2>
        <p v-html="guideContent.information"></p>
      </div>
    </Popover>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Popover from "@/components/Popover";
export default {
  name: "MoreInformation",

  props: {
    type: {
      type: String,
      default: "round"
    },
    hoverPosition: {
      type: String,
      default: "right-end"
    },

    instruction: {
      type: String,
      default: ""
    },
    index: {
      type: String,
      default: "admin"
    }
  },
  computed: {
    ...mapGetters(["getGuide"]),
    guideContent() {
      return this.getGuide[this.index][this.instruction];
    }
  },
  components: {
    Popover
  }
};
</script>
<style lang="scss" scoped>
.bx-info-circle {
  font-size: 19px;
  color: #999;
}
.instructions_content {
  line-height: 1.8em;
}
</style>
