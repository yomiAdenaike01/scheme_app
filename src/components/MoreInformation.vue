<template>
  <div class="moreinformation_container">
    <!-- Create popover with the index of the instructions -->
    <div v-if="informationType == 'popover'">
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
    <div v-else class="more_info_tutorials">
      <i
        class="more_info_tutorials bx bx-question"
        @click="
          UPDATE_DIALOG_INDEX({
            dialog: 'tutorial',
            view: true,
            data: tutorialIndex
          })
        "
      ></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Popover from "@/components/Popover";
export default {
  name: "MoreInformation",

  props: {
    tutorialIndex: {
      type: String
    },
    informationType: {
      type: "String",
      deafault: "popover"
    },
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
.more_info_tutorials {
  border: $border;
  border-color: $default_colour;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
