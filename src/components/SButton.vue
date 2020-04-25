<template functional>
  <div
    :class="['button_container', { flat: props.flat }]"
    @click="listeners.click"
  >
    <span v-if="props.icon" class="icon_container"
      ><i :class="`bx bx-${props.icon}`"></i
    ></span>
    <div class="slot_wrapper">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "SButton",
  props: {
    icon: {
      type: String
    },
    flat: {
      type: Boolean
    }
  }
};
</script>

<style scoped lang="scss">
.button_container {
  background: var(--colour_primary);
  border-radius: 20px;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  box-shadow: -4px 10px 21px var(--colour_even_lighter_primary);
  cursor: pointer;
  position: relative;
  transition: $default_transition opacity;
  will-change: opacity;
  &:hover {
    opacity: 0.9;
  }
  &.flat {
    background: var(--colour_grey);
    box-shadow: none;
    color: white;
  }
}
.slot_wrapper {
  padding: 0 20px;
}
.icon_container {
  bottom: 0;
  display: flex;
  font-size: 1.2em;
  align-items: center;
  order: -1;
  padding: 10px;
  border-radius: 50%;
  background: var(--colour_dark_primary);
}
</style>
