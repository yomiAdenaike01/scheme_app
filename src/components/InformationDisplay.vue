<template>
  <div class="information_display_container">
    <!-- Tutorial -->
    <div v-if="mode == 'tutorial' || mode == 'both'" class="tutorial_container">
      <Popover popperclass="p-0" trigger="click">
        <i slot="trigger" class="bx bx-help-circle tutorial_icon trigger"></i>

        <div slot="content" class="popover_inner_container flex columns">
          <div class="tutorial_title_bar flex flex--end">
            <small class="capitalize">{{ makePretty(tutorial.feature) }}</small>
          </div>
          <div class="information_container flex_center ">
            <i
              class="bx bx-chevron-left trigger"
              @click="slideController('decrease')"
            ></i>
            <div class="popover_inner_text_container flex_center columns">
              <h2 v-html="guideXref[slideIndex].heading"></h2>
              <p v-html="guideXref[slideIndex].content"></p>
            </div>

            <i
              class="bx bx-chevron-right trigger"
              @click="slideController('increase')"
            ></i>
          </div>
          <!-- Indicators -->
          <div class="indicator_container">
            <div
              v-for="(len, index) in guideXref.length"
              :key="index"
              class="indicator"
              :class="{ active: index == slideIndex }"
              @click="slideIndex = index"
            ></div>
          </div>
        </div>
      </Popover>
    </div>
    <!-- Title display -->
    <div
      v-if="mode == 'title' || mode == 'both'"
      :class="displayText.class"
      class="headings_wrapper"
    >
      <slot name="header"></slot>
      <component
        :is="displayText.tag ? displayText.tag : 'h1'"
        class="heading"
        :class="{ txt_center: displayCenter.heading }"
        v-html="displayText.heading"
      />

      <div
        :class="{ txt_center: displayCenter.text }"
        class="heading_text_content"
        v-html="displayText.content"
      ></div>
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import Popover from "@/components/Popover";
export default {
  name: "InformationDisplay",
  components: {
    Popover
  },
  props: {
    mode: {
      type: String,
      default: "title"
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
          tag: "h2",
          headingAlign: "center"
        };
      }
    }
  },
  data() {
    return {
      slideIndex: 0,
      slideInTimeout: null
    };
  },
  computed: {
    ...mapGetters(["getGuide"]),

    displayCenter() {
      return {
        heading: this.displayText?.headingAlign ?? true,
        text: this.displayText?.textAlign ?? true
      };
    },

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
.bx {
  font-size: 2em;
  color: #999;
}
.headings_wrapper {
  margin: 0;
  padding: 0;
  &.extra_line_height {
    line-height: 2em;
  }
}

.tutorial_title_bar {
  background: rgb(250, 250, 250);
  padding: 10px;
  color: #999;
  font-size: 1.2em;
}
.popover_inner_text_container {
  margin: 40px 50px;
}

.indicator_container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 25px 0px;
}
.indicator {
  cursor: pointer;
  margin-left: 20px;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: 10px solid white;
  background: $default_colour;
  transition: $default_transition all;
  &.active {
    box-shadow: $box_shadow;
  }
}
.heading_text_content {
  font-size: 0.9em;
}
</style>
