<template>
  <SlideYUpTransition>
    <div
      v-if="display"
      :class="[
        'overlay_wrapper',
        { light: backdropType == 'blur', dark: backdropType == 'dark' }
      ]"
    >
      <div v-click-outside="onClickOutside" class="overlay">
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
  </SlideYUpTransition>
</template>

<script>
import { SlideYUpTransition } from "vue2-transitions";
import vClickOutside from "v-click-outside";

export default {
  name: "Overlay",
  components: {
    SlideYUpTransition
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
      type: Boolean
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
  &.light {
    backdrop-filter: saturate(180%) blur(15px);
    background: rgba(0, 0, 0, 0.1);
  }
  &.dark {
    background: rgba(0, 0, 0, 0.2);
  }
}
.overlay {
  background: white;
  position: relative;
  border-radius: 10px;
  z-index: 11;
  min-width: 40%;
  max-height: 60%;
  padding: 1%;
  min-height: 60%;
  overflow-x: hidden;
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
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
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
