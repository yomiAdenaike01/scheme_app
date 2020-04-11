<template functional>
  <div
    :class="[
      'action_icon_wrapper',
      data.class,
      data.staticClass,
      { multi_icon: props.displayPlus }
    ]"
  >
    <i
      :class="` bx bx-${props.icon}`"
      @click="
        $event.stopPropgation();
        $listeners.click;
      "
    ></i>
    <i v-if="props.displayPlus" :class="`bx bx-plus`"></i>
    <span>{{ props.text }}</span>
  </div>
</template>

<script>
export default {
  name: "ActionIcon",
  props: {
    displayPlus: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: "plus"
    },
    text: {
      type: String | Number
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
  padding: 5px;
  max-width: fit-content;
  border-radius: 20px;
  border-top-left-radius: 0px;
  &.multi_icon {
    border-radius: 10px;
    border-top-left-radius: inherit;
  }
}
</style>
