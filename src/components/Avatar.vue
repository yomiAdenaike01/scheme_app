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
      type: Boolean
    },
    name: {
      type: String
    },
    initials: {
      type: String
    },
    backgroundColor: {
      type: String
    },
    color: {
      type: String
    },
    customStyle: {
      type: Object
    },
    inline: {
      type: Boolean
    },
    size: {
      type: Number,
      default: 50
    },
    src: {
      type: String
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
        padding: "25px"
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
    },
    lightenColor(hex, amt) {
      // From https://css-tricks.com/snippets/javascript/lighten-darken-color/
      var usePound = false;
      if (hex[0] === "#") {
        hex = hex.slice(1);
        usePound = true;
      }
      var num = parseInt(hex, 16);
      var r = (num >> 16) + amt;
      if (r > 255) r = 255;
      else if (r < 0) r = 0;
      var b = ((num >> 8) & 0x00ff) + amt;
      if (b > 255) b = 255;
      else if (b < 0) b = 0;
      var g = (num & 0x0000ff) + amt;
      if (g > 255) g = 255;
      else if (g < 0) g = 0;
      return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
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
