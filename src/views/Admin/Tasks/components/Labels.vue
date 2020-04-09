<template>
  <!-- Display labels -->
  <div class="labels_container">
    <div class="display_labels">
      <div
        v-for="(label, index) in labels"
        :key="index"
        :style="{ backgroundColor: label.colour }"
        class="label"
        :class="{ mini: modeInterface == 'mini' }"
        @click="setMode"
      >
        <small v-if="modeInterface == 'labelled'">{{ label.name }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Labels",

  props: {
    labels: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: "mini" // mini, labelled,
    }
  },
  data() {
    return {
      labelSearch: "",
      displayForm: false,
      displayPopover: false
    };
  },
  computed: {
    modeInterface: {
      get() {
        return this.mode;
      },
      set(val) {
        this.$emit("changeMode", val);
      }
    }
  },
  methods: {
    setMode() {
      if (this.modeInterface == "labelled") {
        this.modeInterface = "mini";
      } else {
        this.modeInterface = "labelled";
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.display_labels {
  display: flex;
  flex-wrap: wrap;
  max-width: 100%;
}
.labels_container {
  display: flex;
  margin: 10px 0;
}
.label {
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 10px;
  min-width: 50px;
  min-height: 10px;
  cursor: pointer;
  color: white;
  padding: 1px 20px;
  text-transform: capitalize;
  transition: $default_transition;
  &.mini {
    height: 10px;
    padding: 0;
  }
}
</style>
