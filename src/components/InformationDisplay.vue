<template>
  <div class="information_display_container">
    <div v-if="mode == 'tutorial' || mode == 'both'">
      <!-- Tutorial -->
      <div class="tutorial_wrapper">
        <Popover popperclass="no_padding" trigger="click">
          <i slot="trigger" class="bx bx-help-circle tutorial_icon trigger"></i>

          <div slot="content" class="tutorial_container">
            <div class="tutorial_title_bar">
              <small class="capitalize">{{
                makePretty(tutorial.feature)
              }}</small>
            </div>
            <div class="tutorial_content_container">
              <i
                class="bx bx-chevron-left trigger"
                @click="slideController('decrease')"
              ></i>
              <div class="tutorial_text_container">
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
    </div>
    <!-- Title display -->
    <div
      v-if="mode == 'title' || mode == 'both'"
      :class="displayText.class"
      class="headings_wrapper"
    >
      <div
        v-if="$slots.header"
        :class="{ center_icon: displayText.hasIcon }"
        class="slot_container"
      >
        <slot name="header"></slot>
      </div>

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
      <div v-if="$slots.body" class="slot_body_container">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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
          headingAlign: "center",
          hasIcon: false
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
  font-size: 2.3em;
}
.headings_wrapper {
  padding: 30px;
  line-height: 2em;
  .slot_container {
    &.center_icon {
      display: flex;
      justify-content: center;
    }
  }
}
.tutorial_wrapper {
  display: flex;
  justify-content: center;
}
.tutorial_title_bar {
  background: rgb(250, 250, 250);
  color: #999;
  font-size: 1.2em;
  padding: 10px;
}
.tutorial_container {
  display: block;
}
.tutorial_content_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}
.tutorial_text_container {
  text-align: center;
  padding: 0 30px;
}

.indicator_container {
  display: flex;
  justify-content: center;
  margin: 25px 0px;
  width: 100%;
}
.indicator {
  background: $default_colour;
  border: 10px solid white;
  border-radius: 50%;
  cursor: pointer;
  height: 20px;
  margin-left: 20px;
  transition: $default_transition all;
  width: 20px;
  &.active {
    box-shadow: $box_shadow;
  }
}
.heading_text_content {
  font-size: 0.9em;
}
.slot_body_container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
