<template>
  <SlideYUpTransition>
    <div
      v-if="display"
      :class="[
        'dialog_wrapper',
        { light: backdropType == 'blur', dark: backdropType == 'dark' }
      ]"
    >
      <div v-click-outside="onClickOutside" class="dialog">
        <header>
          <div class="close_button" @click="view = false">
            <i class="bx bx-x"></i>
          </div>
          <p class="dialog_header_title">{{ title }}</p>
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
  name: "SDialog",
  components: {
    SlideYUpTransition
  },
  directives: {
    clickOutside: vClickOutside.directive
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
      default: "blur",
      validator(type) {
        return ["dark", "blur"].indexOf(type) > -1;
      }
    }
  },
  computed: {
    view: {
      get() {
        return this.display;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    onClickOutside() {
      this.view = false;
    }
  }
};
</script>

<style scoped lang="scss">
.dialog_wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999999;
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
.dialog {
  background: white;
  border-radius: 10px;
  z-index: 11;
  min-width: 40%;
  min-height: 40%;
  padding: 1%;
  max-height: 60%;
  overflow-x: hidden;
}
section {
  max-height: fit-content;
  transition: max-height 0.3s ease-out;
}
header {
  position: relative;
  background: rgb(250, 250, 250);
  .dialog_header_title {
    text-transform: capitalize;
  }
  .bx {
    position: absolute;
    top: 0;
    right: -10px;
    background: #ccc;
    border-radius: 20px;
    color: whitesmoke;
    padding: 5px;
    cursor: pointer;
  }
}
</style>
