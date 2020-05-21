<template>
  <slide-y-down-transition>
    <div v-if="display" class="pos_container">
      <div class="popup_box_container">
        <s-button
          v-if="closeButton"
          class="close_button only_icon primary"
          icon="x"
          @click="closePopup"
        ></s-button>
        <div v-if="title" class="popup_title_container">
          <h3>{{ title }}</h3>
        </div>
        <div class="slot_body_container">
          <slot name="body" />
        </div>
        <slot name="footer" />
      </div>
    </div>
  </slide-y-down-transition>
</template>

<script>
import { SlideYDownTransition } from "vue2-transitions";
import SButton from "@/components/SButton";
export default {
  name: "Bot",
  components: {
    SlideYDownTransition,
    SButton
  },
  model: {
    event: "close",
    prop: "display"
  },
  props: {
    title: {
      type: String
    },
    timeout: {
      type: Boolean,
      default: true
    },
    display: {
      type: Boolean,
      default: false
    },
    closeButton: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      displayTimeout: null
    };
  },
  created() {
    if (this.timeout) {
      clearTimeout(this.displayTimeout);

      this.displayTimeout = setTimeout(() => {
        this.closePopup();
      }, 4500);
    }
  },
  methods: {
    closePopup() {
      this.$emit("close", false);
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
    left: 4%;
  }
  &.right {
    right: 1%;
  }
}

.popup_box_container {
  box-shadow: $box_shadow;
  position: relative;
  background: white;
  max-width: 300px;
  z-index: 999995;
  &/deep/ .close_button {
    position: absolute;
    right: 0;
    top: -20px;
    padding: -2px;
  }
}
.popup_title_container {
  padding: 10px;
  border-bottom: $border;
}
.slot_body_container {
  padding: 10px;
}
</style>
