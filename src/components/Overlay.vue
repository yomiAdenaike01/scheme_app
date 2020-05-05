<template>
  <SlideYDownTransition>
    <div
      v-if="display"
      :class="[
        'overlay_wrapper',
        { light: backdropType == 'blur', dark: backdropType == 'dark' }
      ]"
    >
      <div v-show="display" v-click-outside="onClickOutside" class="overlay">
        <div class="close_button" @click="$emit('close')">
          <i class="bx bx-x"></i>
        </div>
        <header>
          <p class="overlay_header_title">{{ title }}</p>
          <slot name="header" />
        </header>
        <section>
          <slot />
        </section>
        <footer v-if="$slots.footer">
          <slot name="footer" />
        </footer>
      </div>
    </div>
  </SlideYDownTransition>
</template>

<script>
import { SlideYDownTransition } from "vue2-transitions";
import vClickOutside from "v-click-outside";

export default {
  name: "Overlay",
  components: {
    SlideYDownTransition
  },
  directives: {
    clickOutside: vClickOutside.directive
  },
  model: {
    prop: "display",
    event: "close"
  },
  props: {
    display: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: null
    },
    backdropType: {
      type: String,
      default: "dark",
      validator(type) {
        return ["dark", "blur"].indexOf(type) > -1;
      }
    }
  },

  beforeMount() {
    window.addEventListener("keyup", this.onEscapeKeyUp);
  },
  beforeDestroy() {
    window.removeEventListener("keyup", this.onEscapeKeyUp);
  },
  methods: {
    onClickOutside(e) {
      if (e.target.classList.value.includes("overlay_wrapper")) {
        this.$emit("close");
      }
    },
    onEscapeKeyUp(event) {
      if (event.which === 27) {
        this.$emit("close");
      }
    }
  }
};
</script>

<style scoped lang="scss">
.overlay_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  &.light {
    backdrop-filter: saturate(180%) blur(15px);
    background: rgba(0, 0, 0, 0.1);
  }
  &.dark {
    background: rgba(0, 0, 0, 0.5);
  }
}
.overlay {
  background: white;
  position: relative;
  border-radius: 5px;
  z-index: 11;
  min-width: 40%;
  padding-top: 1%;
}
section {
  max-height: fit-content;
  transition: max-height 0.3s ease-out;
}
header {
  background: rgb(250, 250, 250);
  .overlay_header_title {
    text-transform: capitalize;
  }
}
.close_button {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 1.5em;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #555;
  }
}
</style>
