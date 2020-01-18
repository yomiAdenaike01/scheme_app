<template>
  <div class="moreinformation_container">
    <Popover :position="hoverPosition" trigger="click" width="250">
      <el-button
        slot="trigger"
        round
        icon="el-icon-help"
        @click="displayInstructions=!displayInstructions"
      ></el-button>
      <div slot="content" class="instructions_content" v-if="displayInstructions">
        <h3 class="mb-2">{{returnInstructionsContent.title}}</h3>
        <p>{{returnInstructionsContent.information}}</p>
      </div>
    </Popover>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Popover from "@/components/Popover";
export default {
  name: "MoreInformation",
  data() {
    return {
      displayInstructions: ""
    };
  },
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

<style>
</style>