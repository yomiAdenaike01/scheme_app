<template>
  <!-- Display labels -->
  <div class="labels_container">
    <el-popover
      v-if="modeInterface == 'board'"
      trigger="click"
      placement="right"
    >
      <div slot="reference" class="create_label_trigger grey">
        <i class="bx bx-label"></i> <span>Labels</span>
      </div>
      <Form
        class="full_width"
        :submit-button="{
          text: 'Create label',
          size: 'mini',
          plain: true,
          type: 'primary'
        }"
        :config="createLabelConfig"
        @val="$emit('update')"
      >
        <div slot="footer" class="form_footer">
          <ColourUnit v-model="colourUnitVal" />
          <span class="grey">{{ colourUnitVal }}</span>
        </div>
      </Form>
    </el-popover>
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
    <ActionIcon @click="$emit('addLabel')" />
  </div>
</template>

<script>
export default {
  name: "Labels",
  components: {
    Form: () => import("@/components/Form"),
    ColourUnit: () => import("@/components/ColourUnit"),
    ActionIcon: () => import("@/components/ActionIcon")
  },
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
      displayPopover: false,
      page: 0,
      colourUnitVal: "#fff"
    };
  },
  computed: {
    createLabelConfig() {
      return [
        {
          "component-type": "text",
          model: "name",
          placeholder: "Label name"
        }
      ];
    },
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
.create_label_trigger {
  display: flex;
  flex: 1;
  background: rgb(250, 250, 250);
  padding: 50px;
  cursor: pointer;
  border-radius: 10px;
}
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
.form_footer {
  display: flex;
  align-items: center;
  span {
    margin-left: 20px;
    background: whitesmoke;
    padding: 10px;
    border-radius: 5px;
  }
}
</style>
