<template>
  <div class="flex_center h-100 columns">
    <i :class="`${icon} icon-large`"></i>
    <p class="desc m-4 txt-center l-height-large">{{ text }}</p>
    <MoreInformation v-if="moreInformation" v-bind="moreInformation" />
    <slot v-else></slot>
  </div>
</template>

<script>
import MoreInformation from "./MoreInformation";
export default {
  name: "Nocontent",
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
<style lang="scss">
.icon-large {
  font-size: 3em;
}
</style>
