<template>
  <div class="information_display_container">
    <!-- Tutorial -->
    <div v-if="mode == 'tutorial' || mode == 'both'" class="tutorial_container">
      <Popover trigger='click'>
          <i class='bx bx-help-circle tutorial_icon' slot="trigger"></i>

        <div slot='content' class="popover_inner_container flex columns">
          <div class="information_container flex_center ">
            <i
              @click="slideController('decrease')"
              class="bx bx-chevron-left "
            ></i>
              <div class="popover_inner_text_container flex_center columns"
              >
                <h2>{{ guideXref[slideIndex].content }}</h2>
                <p>{{guideXref[slideIndex].heading}}</p>
              </div>

            <i
              @click="slideController('increase')"
              class="bx bx-chevron-right"
            ></i>
          </div>
          <!-- Indicators -->
          <div class="indicator_container">
            <div class="indicator" v-for="(len,index) in guideXref.length" :key='index' @click="slideIndex = index" :class="{active:index==slideIndex}"></div>
          </div>
        </div>
      </Popover>
    </div>
    <!-- Title display -->
    <div class="headings_wrapper m-0 p-0" v-if="mode == 'title' || mode == 'both'">
      <component
        class="heading"
        :is="displayText.tag ? displayText.tag : 'h2'"
        v-html="displayText.heading"
      />
      <div v-html="displayText.content"></div>
      <slot name="information"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import Popover from "@/components/Popover";
export default {
  name: "InformationDisplay",
  data() {
    return {
      slideIndex: 0
    };
  },
  props: {
    mode: {
      type: String,
      default: "tutorial"
    },
    tutorial: {
      type: Object,
      default: () => {
        return {
          module: "",
          feature: "",
          displayType: "hover"
        };
      }
    },
    displayText: {
      type: Object,
      default: () => {
        return {
          heading: "",
          content: "",
          tag: "h2"
        };
      }
    }
  },
  components: {
    Popover
  },
  computed: {
    ...mapGetters(["getGuide"]),

    guideXref() {
      let moduleContent = this.getGuide[this.tutorial.module];
      let guideContent = [];

      for (let i = 0, len = moduleContent.length; i < len; i++) {
        let module = this.getGuide[this.tutorial.module][i];
        guideContent = module[this.tutorial.feature];
      }
      return guideContent;
    }
  },
  methods: {
    slideController(controlMethod) {
      const slideLength = this.guideXref.length;
      if (controlMethod == "increase") {
        if (this.slideIndex + 1 >= slideLength) {
          this.slideIndex = 0;
        } else {
          this.slideIndex++;
        }
      } else {
        if (this.slideIndex - 1 <= slideLength) {
          this.slideIndex = 0;
        } else {
          this.slideIndex--;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.popover_inner_container {
  display: flex;
  justify-content: space-between;
}
.bx{
  font-size: 2em;
}
.headings_wrapper {
  line-height: 2.5em;
  .heading {
    color: #888;
  }
}
.popover_inner_text_container{
  margin: 40px 50px;
}
.indicator_container{
  display:flex;
  width: 100%;
  justify-content: center;
  margin-top: 20px;
}
.indicator{
  cursor: pointer;
  margin-left:20px;
  border-radius: 50%;
  width:20px;
  height:20px;
  border:10px solid white;
  background:$default_colour;
  transition:$default_transition all;
  &.active{
    box-shadow: $box_shadow;
  }
}
</style>
