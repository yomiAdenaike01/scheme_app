<template>
  <slide-y-down-transition>
    <div v-if="display" class="pos_container">
      <div class="popup_box_container">
        <s-button
          v-if="closeButton"
          class="close_button only_icon primary"
          icon="x"
          @click="$emit('close')"
        ></s-button>
        <slot />
      </div>
    </div>
  </slide-y-down-transition>
</template>

<script>
import { SlideYDownTransition } from "vue2-transitions";
import SButton from "@/components/SButton";
export default {
  name: "PopupBox",
  components: {
    SlideYDownTransition,
    SButton
  },
  props: {
    display: {
      type: Boolean,
      default: false
    },
    closeButton: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="scss">
.pos_container {
  position: fixed;
  bottom: 30px;
  max-width: 400px;
  &.left {
    left: 1%;
  }
  &.right {
    right: 1%;
  }
}
// .left .popup_box_container ::after {
//   content: "";
//   position: absolute;
//   bottom: 50%;
//   left: -26px;
//   border-top: 15px solid transparent;
//   border-right: 15px solid white;
//   border-left: 15px solid transparent;
//   border-bottom: 15px solid transparent;
// }
.popup_box_container {
  box-shadow: $box_shadow;
  position: relative;
  //   &::after {
  //     content: "";
  //     position: absolute;
  //     bottom: 50%;
  //     border-top: 15px solid transparent;
  //     border-right: 15px solid transparent;
  //     border-left: 15px solid white;
  //     right: -26px;
  //     border-bottom: 15px solid transparent;
  //   }
}
.close_button {
  position: absolute;
  left: 0;
}
</style>
