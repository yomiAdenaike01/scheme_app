<template>
  <el-form class="p-1" :inline="inline" :disabled="disableForm" :size="size">
    <el-form-item
      v-for="(input, index) in config"
      :key="index"
      :prop="input.name"
      :label="input.label"
    >
      <component
        :size="size"
        class="dialog_item"
        :is="
          input['component-type'] == 'text' ||
          input['component-type'] == 'password'
            ? 'el-input'
            : input['component-type'] == 'select'
            ? 'el-select'
            : input['component-type'] == 'date-picker'
            ? 'el-date-picker'
            : input['component-type'] == 'number'
            ? 'el-input-number'
            : null
        "
        v-model="formContent[input.model]"
        :value-key="input.text || input.name"
        :show-password="input['component-type'] == 'password'"
        :min="input.min"
        :max="input.max"
        :type="
          input['input-type'] == 'date'
            ? 'date'
            : input['input-type'] == 'date-time-range'
            ? 'datetimerange'
            : input.hasOwnProperty('textarea')
            ? 'textarea'
            : input['input-type'] == 'date-time'
            ? 'datetime'
            : null
        "
        v-bind="input"
        :required="input.required"
        :disabled="input.disabled"
        :start-placeholder="input.start_placeholder"
        :end-placeholder="input.end_placeholder"
        :multiple="input.multiple"
        :clearable="true"
      >
        <el-option
          v-for="option in input.options"
          :label="option.text || option.name"
          :key="option.value"
          :value="option.value ? option.value : option.text || option.name"
          >{{ option.text || option.name }}</el-option
        >
      </component>
      <!-- Hint -->
      <small class="description" v-if="input.hint" v-html="input.hint"></small>
    </el-form-item>

    <!-- Submit button -->
    <div class="button_container mt-4" v-if="!disable">
      <el-button
        size="mini"
        type="primary"
        class="button_text"
        round
        @click="submitForm"
        >{{ submitText }}</el-button
      >
    </div>
  </el-form>
</template>

<script>
export default {
  name: "Form",
  activated() {
    if (this.preModel) {
      this.$set(this, "formContent", this.preModel);
    }
  },

  data() {
    return {
      formContent: {}
    };
  },
  props: {
    inline: {
      type: Boolean,
      default: false
    },
    preModel: {
      default: Object,
      required: false
    },
    disableForm: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: "Submit"
    },
    config: {
      type: Array,
      default: null
    },
    customMethod: {
      type: Function,
      default: null
    },
    size: {
      type: String,
      default: "medium"
    },
    liveUpdate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    submitForm() {
      this.$emit("val", this.formContent);
      // comments
      if (this.customMethod) {
        this.customMethod();
      }

      if (this.nextTab) {
        this.$emit("changeTab");
      }
    }
  },
  watch: {
    formContent: {
      deep: true,
      handler(val) {
        if (this.liveUpdate) {
          this.$emit("val", val);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.button_container {
  display: flex;
  justify-content: flex-end;
}
.button_text {
  text-transform: capitalize;
}
.dialog_item {
  width: 70%;
}
.description {
  display: block;
  padding: 0;
  margin: 0;
  color: #999;
}
</style>
