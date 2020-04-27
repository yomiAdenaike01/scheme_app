<template functional>
  <div
    :class="[
      'button_container',
      data.staticClass,
      data.class,
      {
        [props.colourScheme]: props.colourScheme,
        flat: props.flat,
        button_shadow: props.shadow,
        center: props.center,
        only_icon: props.onlyIcon
      }
    ]"
    v-on="listeners"
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
    },
    center: {
      type: Boolean
    },
    noTrigger: {
      type: Boolean
    }
  }
};
</script>

<style scoped lang="scss">
$shadow: -4px 10px 21px var(--colour_even_lighter_primary);

.button_container {
  font-size: 0.9em;
  background: var(--colour_primary);
  border-radius: 20px;
  display: flex;
  padding: 2px;
  align-items: center;
  color: white;
  min-height: 30px;
  cursor: pointer;
  position: relative;
  transition: $default_transition;
  will-change: opacity;
  max-width: 500px;
  &.no_trigger {
    cursor: initial;
  }
  &.only_icon {
    max-width: fit-content;
  }
  &.center {
    text-align: center;
    justify-content: center;
  }
  &.flat {
    background: rgba(200, 200, 200, 0.3);
    color: rgb(150, 150, 150);
    transition: $default_transition;
    &:hover,
    &.active {
      transform: translateY(-5px);
      background: rgb(230, 230, 230);
      color: rgb(10, 10, 10);
    }
  }
  &.button_shadow {
    box-shadow: -2px 11px 21px var(--colour_even_lighter_primary);
  }
  &.secondary {
    background: var(--colour_secondary);

    &.button_shadow {
      box-shadow: -2px 11px 21px var(--colour_secondary_lighter);
    }
  }
  &.tertiary {
    background: var(--colour_tertiary);

    &.button_shadow {
      box-shadow: -2px 11px 21px var(--colour_tertiary_lighter);
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
  background: rgba(0, 0, 0, 0.09);
  color: white;
  &.inverse_icon {
    order: -1;
  }
}
</style>
