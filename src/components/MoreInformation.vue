<template>
  <div class="moreinformation_container">
    <Popover :position="hoverPosition" trigger="hover" width="250">
      <el-button slot="trigger" size="mini" round type="primary">More Information</el-button>
      <div slot="content" class="instructions_content">
        <h3 class="mb-2">{{returnInstructionsContent.title}}</h3>
        <p style="line-height:1.5em">{{returnInstructionsContent.information}}</p>
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
      default: ""
    }
  },
  computed: {
    ...mapGetters(["getInstructions"]),
    returnInstructionsContent() {
      return this.getInstructions[this.index][this.instruction];
    }
  },
  components: {
    Popover
  }
};
</script>
