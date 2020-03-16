<template>
  <el-dialog :visible.sync="tutorialView" v-if="getActiveDialog('tutorial')">
    <div class="tutorial_container p-3">
      <div class="info_container flex align-center flex--space-between">
        <i
          class="el-icon arrow el-icon-arrow-left"
          @click="slideController('minus')"
        ></i>
        <transition-group
          tag="div"
          style="width:60%"
          mode="in-out"
          name="slide_tutorial"
        >
          <div
            class="current_slide_info_wrapper"
            :key="
              `${Math.random()
                .toString(16)
                .slice(2)}`
            "
            v-for="slideIn in [currentSlideInfo]"
          >
            <h1 class="black">{{ slideIn.title }}</h1>
            <p>{{ slideIn.body }}</p>
            <img
              v-show="slideIn.image"
              :src="slideIn.image ? slideIn.image : ''"
            />
          </div>
        </transition-group>
        <i
          class="el-icon arrow el-icon-arrow-right"
          @click="slideController('plus')"
        ></i>
      </div>

      <div class="slide_indicator_container flex_center mt-5">
        <div
          :class="{ active: currentSlide == slide - 1 }"
          v-for="(slide, index) in totalSlides"
          :key="slide"
          class="slide_indicator"
          @click="currentSlide = index"
        ></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { tutorials } from "@/stubs/tutorials";
export default {
  name: "Tutorial",

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
  background: $default_colour;
  border: 13px solid white;
  width: 20px;
  height: 20px;
  transition: $default_transition;
  cursor: pointer;
  &.active {
    box-shadow: $box_shadow;
    background: $default_colour;
  }
}
.arrow {
  font-size: 20px;
  color: #ccc;
}
.current_slide_info_wrapper {
  width: 80%;
}
.current_slide_info_image {
  background: linear-gradient(black, white, 50%);
}
h1 {
  font-size: 3em;
}
/*=============================================
=            Transitions            =
=============================================*/

.slide_tutorial-enter-active,
.slide_tutorial-leave-active {
  transition: all 0.6s linear;
}
.slide_tutorial-enter, .slide_tutorial-leave-to /* .list-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateX(100%);
}
</style>
