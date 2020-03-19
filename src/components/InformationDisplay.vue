<template>
  <div class="flex_center h-100 columns">
    <i :class="`${icon} icon-large grey`"></i>
    <p class="desc m-4 txt-center l-height-large" v-html="text"></p>
    <MoreInformation v-if="moreInformation" v-bind="moreInformation" />

    <slot v-else></slot>
  </div>
</template>

<script>
import MoreInformation from "./MoreInformation";
export default {
  name: "InformationDisplay",
  props: {
    icon: {
      type: String
    },
    text: {
      type: String
    },
    moreInformation: {
      type: Object
    }
  },
  components: {
    MoreInformation
  }
};
</script>
<style lang="scss" scoped>
.icon-large {
  font-size: 3em;
}
.title_wrapper {
  color: black;
  &.m-0 {
    margin: 0;
  }

  &.p-0 {
    padding: 0;
  }
}
</style>
