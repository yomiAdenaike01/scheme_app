<template>
  <div
    :class="['avatar_wrapper', { grouped: group }]"
    :style="[style, customStyle]"
    aria-hidden="true"
  >
    <p v-show="!this.isImage">{{ userInitial }}</p>
    <slot />
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Avatar",
  props: {
    group: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    initials: {
      type: String,
      default: ""
    },
    backgroundColor: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    customStyle: {
      type: Object,
      default: () => {}
    },
    inline: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 50
    },
    src: {
      type: String,
      default: ""
    },
    rounded: {
      type: Boolean,
      default: true
    },
    lighten: {
      type: Number,
      default: 80
    }
  },

  computed: {
    ...mapState(["colours"]),
    background() {
      let backgroundColour = "";
      if (!this.isImage) {
        backgroundColour =
          this.backgroundColor ||
          this.randomBackgroundColor(this.name.length, this.colours);
      }
      return backgroundColour;
    },

    isImage() {
      return Boolean(this.src);
    },
    style() {
      const style = {
        display: this.inline ? "inline-flex" : "flex",
        width: `${this.size}px`,
        height: `${this.size}px`,
        borderRadius: this.rounded ? "50%" : 0,
        lineHeight: `${this.size + Math.floor(this.size / 20)}px`,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        userSelect: "none",
        position: "relative"
      };
      const imgBackgroundAndFontStyle = {
        background: `transparent url('${this.src}') no-repeat scroll 0% 0% / ${this.size}px ${this.size}px content-box border-box`
      };
      const initialBackgroundAndFontStyle = {
        backgroundColor: this.background,
        color: "white",
        padding: "25px",
        font: `${Math.floor(this.size / 2.5)}px/${
          this.size
        }px IBM Plex Sans, sans-serif`
      };
      const backgroundAndFontStyle = this.isImage
        ? imgBackgroundAndFontStyle
        : initialBackgroundAndFontStyle;
      Object.assign(style, backgroundAndFontStyle);
      return style;
    },
    userInitial() {
      if (!this.isImage) {
        const initials = this.initials || this.initial(this.name);
        return initials;
      }
      return "";
    }
  },

  methods: {
    initial(username) {
      let parts = username.split(/[ -]/);
      let initials = "";
      for (var i = 0; i < parts.length; i++) {
        initials += parts[i].charAt(0);
      }
      if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
        initials = initials.replace(/[a-z]+/g, "");
      }
      initials = initials.substr(0, 2).toUpperCase();
      return initials;
    },
    randomBackgroundColor(seed, colors) {
      return colors[seed % colors.length];
    }
  }
};
</script>
<style lang="scss" scoped>
.avatar_wrapper.grouped {
  margin-left: -30px;
  transition: $default_transition transform;
  will-change: transform;
  cursor: pointer;
  &:hover {
    transform: translateX(-15px);
  }
}
</style>
