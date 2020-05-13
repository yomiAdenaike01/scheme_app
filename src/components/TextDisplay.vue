<template functional>
  <div class="text_display_container" :class="[data.class, data.staticClass]">
    <!-- Title display -->
    <div v-if="mode == 'title' || mode == 'both'" class="headings_wrapper">
      <div
        v-if="$slots.header"
        :class="{ center_icon: props.displayText.hasIcon }"
        class="slot_container"
      >
        <slot name="header"></slot>
      </div>

      <h2 class="heading" v-html="props.displayText.heading" />

      <p class="heading_text_content" v-html="props.displayText.content"></p>
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
  }
};
</script>

<style lang="scss" scoped>
.el-popover_inner_container {
  display: flex;
  justify-content: space-between;
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
