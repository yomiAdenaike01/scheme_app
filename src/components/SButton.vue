<template functional>
  <div
    :class="[
      'button_container',
      {
        primary: colourScheme == 'primary',
        secondary: colourScheme == 'secondary',
        teritiary: colourScheme == 'tertiary',
        flat: props.flat,
        button_shadow: props.shadow
      }
    ]"
    @click="listeners.click"
  >
    <div v-if="!props.onlyIcon" class="slot_wrapper">
      <slot />
    </div>
    <span
      v-if="props.icon"
      :class="['icon_container', { inverse_icon: props.inverseIcon }]"
      ><i :class="`bx bx-${props.icon}`"></i
    ></span>
  </div>
</template>

<script>
export default {
  name: "SButton",
  props: {
    icon: {
      type: String,
      default: null
    },
    flat: {
      type: Boolean
    },
    shadow: {
      type: Boolean
    },
    colourScheme: {
      type: String,
      default: "primary"
    },
    onlyIcon: {
      type: Boolean,
      default: false
    },
    inverseIcon: {
      type: Boolean
    }
  }
};
</script>

<style scoped lang="scss">
.button_container {
  font-size: 0.9em;
  background: var(--colour_primary);
  border-radius: 20px;
  display: flex;
  padding: 3px;
  align-items: center;
  color: white;
  min-height: 30px;

  cursor: pointer;
  position: relative;
  transition: $default_transition;
  will-change: opacity;
  &:hover {
    box-shadow: -4px 10px 21px var(--colour_even_lighter_primary);
  }
  &.flat {
    background: var(--colour_grey);
    box-shadow: none;
    color: white;
  }
  &.button_shadow {
    box-shadow: -4px 10px 21px var(--colour_even_lighter_primary);
  }
  .secondary {
    background: var(--colour_secondary);
    .icon_container {
      background: var(--colour_dark_secondary);
    }
  }
  .teritiary {
    background: var(--colour_tertiary);
    .icon_container {
      background: var(--colour_dark_tertiary);
    }
  }
}
.slot_wrapper {
  padding: 10px 20px;
}
.icon_container {
  display: flex;
  font-size: 1.2em;
  align-items: center;
  padding: 10px;
  margin: 0;
  border-radius: 50%;
  background: var(--colour_dark_primary);
  color: white;
  &.inverse_icon {
    order: -1;
  }
}
</style>
