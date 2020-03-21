<template>
  <div class="information_display_container">
    <!-- Tutorial -->
    <div v-if="mode == 'tutorial' || mode == 'both'" class="tutorial_container">
      <Popover popperclass='p-0' trigger='click'>
          <i class='bx bx-help-circle tutorial_icon trigger' slot="trigger"></i>

        <div slot='content' class="popover_inner_container flex columns">
          <div class="tutorial_title_bar flex flex--end">
            <small class="capitalize">{{makePretty(tutorial.feature)}}</small>
          </div>
          <div class="information_container flex_center ">
            <i
              @click="slideController('decrease')"
              class="bx bx-chevron-left "
            ></i>
              <div class="popover_inner_text_container flex_center columns"
              >
                <h2>{{ guideXref[slideIndex].heading }}</h2>
                <p>{{guideXref[slideIndex].content}}</p>
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
      <div class="slot_container mb-4">
        <slot name="above_header"></slot>
      </div>
      <component
        class="heading mb-3"
        :class="{txt_center:displayCenter.heading}"
        :is="displayText.tag ? displayText.tag : 'h3'"
        v-html="displayText.heading"
      />
        
      <div :class="{txt_center:displayCenter.text}" class="heading_text_content mb-4" v-html="displayText.content"></div>
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
          headingAlign:'center'
        };
      }
    }
  },
  components: {
    Popover
  },
  computed: {
    ...mapGetters(["getGuide"]),

    displayCenter(){
      return {
        heading:this.displayText?.headingAlign ?? true,
        text:this.displayText?.textAlign ?? true
    }
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
.bx{
  font-size: 2em;
  color: #999;
}
.headings_wrapper {
  .heading {
    color: #888;
  }
}
.heading{
&.center{
  text-align: center;
}

}
.tutorial_title_bar{
  background:rgb(250,250,250);
  padding:10px;
  color: #999;
  font-size: 1.2em;
}
.popover_inner_text_container{
  margin: 40px 50px;
}
.indicator_container{
  display:flex;
  width: 100%;
  justify-content: center;
  margin: 25px 0px;
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
.heading_text_content{
  font-size: .9em;
}
</style>
