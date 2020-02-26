<template>
  <el-dialog :visible.sync="tutorialView" v-if="getActiveDialog('tutorial')">
    {{currentSlideInfo}}
    <div class="slide_indicator_container">
      <div
        :class="{active:currentSlide == slide - 1}"
        v-for="slide in totalSlides"
        :key="slide"
        class="slide_indicator"
      ></div>
    </div>
    <i class="el-icon el-icon-arrow-right" @click="slideController('plus')"></i>
    <i class="el-icon el-icon-arrow-left" @click="slideController('minus')"></i>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { tutorials } from "@/stubs/tutorials";
export default {
  name: "Tutorial",
  activated() {
    console.log(this.dialogIndex, tutorials[this.dialogIndex.tutorial.data]);
  },

  data() {
    return {
      currentSlide: 0
    };
  },

  computed: {
    ...mapState(["dialogIndex"]),
    ...mapGetters(["getActiveDialog"]),
    tutorialsDictionary() {
      return tutorials;
    },
    tutorialView: {
      get() {
        return this.getActiveDialog("tutorial");
      },
      set(val) {
        this.closeDialog("tutorial");
      }
    },
    totalSlides() {
      return this.slideDictionary.length;
    },
    slideDictionary() {
      return this.tutorialsDictionary[this.dialogIndex.tutorial.data];
    },
    currentSlideInfo() {
      return this.slideDictionary[this.currentSlide];
    }
  },
  methods: {
    ...mapActions(["closeDialog"]),
    slideController(direction) {
      if (direction == "plus") {
        if (this.currentSlide + 1 == this.totalSlides) {
          this.$set(this, "currentSlide", 0);
        } else {
          this.currentSlide++;
        }
      } else {
        if (this.currentSlide - 1 == 0) {
          this.$set(this, "currentSlide", this.totalSlides);
        } else {
          this.currentSlide--;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.slide_indicator_container {
  display: flex;
  align-items: center;
}
.slide_indicator {
  border-radius: 50%;
  background: rgb(235, 233, 233);
  width: 10px;
  height: 10px;
  &.active {
    background: red;
  }
}
</style>