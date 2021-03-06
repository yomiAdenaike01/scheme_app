<template functional>
  <div
    :style="props.buttonStyle"
    :class="[
      'button_container capitalize',
      data.staticClass,
      data.class,
      {
        flat: props.flat,
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

    buttonStyle: {
      type: Object
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
    }
  }
};
</script>

<style scoped lang="scss">
$sbutton_config: (
  primary: var(--colour_primary),
  secondary: var(--colour_secondary),
  tertiary: var(--danger),
  grey: var(--colour_grey)
);
$shadow: -4px 10px 21px var(--colour_even_lighter_primary);
.no_cap {
  text-transform: initial;
}
.button_container {
  font-size: 0.9em;
  background: rgba(var(--colour_primary), 1);
  display: flex;
  padding: 2px;
  align-items: center;
  color: white;
  min-height: 30px;
  cursor: pointer;
  position: relative;
  transition: $default_transition;
  will-change: opacity;
  white-space: nowrap;
  max-width: fit-content;
  justify-content: space-between;
  &.pill {
    .slot_wrapper,
    .icon_container {
      padding: 5px;
    }
  }
  &.full_width {
    flex: 1;
  }
  &.rounded {
    border-radius: 20px;
    .icon_container {
      border-radius: 50%;
    }
  }
  &.no_trigger {
    cursor: initial;
  }
  &.only_icon {
    border-radius: 50%;
    text-align: center;
    .slot_wrapper {
      padding: 0;
    }
    .icon_container {
      background: transparent;
    }
  }
  &.expanded {
    flex: 1;
    max-width: initial;
  }
  &.center {
    text-align: center;
    justify-content: center;
  }
  &.plain {
    background: white;
    color: initial;
    border: 1px solid rgb(220, 220, 220);
    max-width: fit-content;
    padding: 0;
    margin: 5px 0;
    &:hover,
    &.active {
      border: 1px solid rgba(var(--colour_secondary), 0.8);
      color: rgba(var(--colour_secondary), 1);
      background: rgba(var(--colour_secondary), 0.07);
    }
  }

  @each $key, $value in $sbutton_config {
    &.#{$key} {
      background: rgba($value, 1);

      &.shadow {
        box-shadow: -2px 11px 21px rgba($value, 0.5);
      }
      &.bordered {
        border: 1px solid rgba($value, 1);
        background: transparent;
        color: rgba($value, 1);
      }
      &.text {
        padding: 5px;
        background: transparent;
        color: rgba($value, 1);
      }
    }
  }

  &.small {
    font-size: 0.9em;
    padding: 3px;
  }
  &.mini {
    font-size: 0.8em;
    padding: 0px;
  }

  .icon_container {
    background: rgba(0, 0, 0, 0.14);
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
  color: white;
  &.inverse_icon {
    order: -1;
  }
}
</style>
