<template functional>
  <div
    :class="[
      'action_icon_wrapper',
      data.class,
      data.staticClass,
      { multi_icon: props.displayPlus, rounded: props.actionStyle == 'rounded' }
    ]"
  >
    <i :class="` bx bx-${props.icon}`" v-on="$listeners"></i>
    <span v-if="props.text.length > 0">{{ props.text }}</span>
  </div>
</template>

<script>
export default {
  name: "ActionIcon",
  props: {
    actionStyle: {
      type: String,
      default: "rounded"
    },
    displayPlus: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: "plus"
    },
    text: {
      type: String | Number,
      default: ""
    }
  }
};
</script>

<style lang="scss">
.action_icon_wrapper {
  border: 2px dashed rgb(240, 240, 240);
  border-radius: 5px;
  color: rgb(200, 200, 200);
  cursor: pointer;
  display: block;
  padding: 9px;
  width: fit-content;
  span {
    margin-left: 5px;
    font-size: 1em;
  }
  &.rounded {
    border-radius: 50%;
    border-top-left-radius: 0px;
  }
  border-radius: 5px;
  &.multi_icon {
    border-radius: 10px;
    border-top-left-radius: inherit;
  }
}
</style>
