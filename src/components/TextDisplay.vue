<template>
  <div class="text_display_container">
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
        :is="displayText.tag ? displayText.tag : 'h2'"
        class="heading"
        :class="{ txt_center: displayCenter.heading }"
        v-html="displayText.heading"
      />

      <div
        :class="[displayText.contentClass, { txt_center: displayCenter.text }]"
        class="heading_text_content"
        v-html="displayText.content"
      ></div>
      <div v-if="$slots.body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TextDisplay",
  props: {
    mode: {
      type: String,
      default: "title"
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

  computed: {
    displayCenter() {
      return {
        heading: this.displayText?.headingAlign ?? false,
        text: this.displayText?.textAlign ?? false
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.el-popover_inner_container {
  display: flex;
  justify-content: space-between;
}
.bx {
  font-size: 2.3em;
}
.headings_wrapper {
  padding: 30px;
  &.align_left {
    text-align: left;
  }
  &.align_right {
    text-align: right;
  }
  .heading {
    font-weight: 500;
    margin-bottom: 5px;
  }
  .slot_container {
    &.center_icon {
      display: flex;
      justify-content: center;
    }
  }
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
  max-width: 600px;
}
</style>
