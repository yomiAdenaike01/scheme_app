<template>
  <div class="form_wrapper" @keyup.enter="submitForm">
    <slot name="header"></slot>
    <el-form
      ref="form"
      class="form"
      :inline="inline"
      :disabled="disableForm"
      :rules="form.validate"
      :model="formContent"
      label-position="top"
    >
      <el-form-item
        v-for="(input, index) in form.formData"
        :key="`${index}${input.name}`"
        :prop="input.name"
        :label="
          input.noLabel
            ? ''
            : input.optional || (allOptional && !input.noLabel)
            ? `(Optional) ${input.placeholder}`
            : input.placeholder
        "
      >
        <span
          v-if="
            Object.values(headings).length > 0 &&
              headings.hasOwnProperty(input.model)
          "
          slot="label"
          class="form_item_heading"
          v-html="headings[input.model]"
        ></span>
        <component
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
              : input['component-type'] == 'time-picker'
              ? 'el-time-picker'
              : input['component-type'] == 'switch'
              ? 'el-switch'
              : null
          "
          v-model="formContent[input.model]"
          class="dialog_item"
          :value-key="input.text || input.name"
          :show-password="input['component-type'] == 'password'"
          :min="input.min"
          :max="input.max"
          filterable
          :option="input.options"
          :props="input.cascaderProps"
          :picker-options="input.pickerOptions"
          :is-range="input.isRange"
          :type="
            input['input-type'] == 'date'
              ? 'date'
              : input['input-type'] == 'date-time-range'
              ? 'datetimerange'
              : input['input-type'] == 'textarea'
              ? 'textarea'
              : input['input-type'] == 'date-time'
              ? 'datetime'
              : input['input-type'] == 'dates'
              ? 'dates'
              : null
          "
          v-bind="input"
          :active-text="
            input.optional || allOptional
              ? `(Optional) ${input.placeholder}`
              : input.placeholder
          "
          :disabled="input.disabled"
          :start-placeholder="input.start_placeholder"
          :end-placeholder="input.end_placeholder"
          :multiple="input.multiple"
          :clearable="true"
          @change="input.onChange ? input.onChange : null"
        >
          <el-option
            v-for="option in input.options"
            :key="option.value"
            :label="option.text || option.name || option.label"
            :value="option.value ? option.value : option.text"
          />
        </component>
        <!-- Hint -->
        <small
          v-if="input.hint"
          class="description"
          v-html="input.hint"
        ></small>
      </el-form-item>

      <slot name="footer"></slot>
    </el-form>
    <!-- Submit button -->
    <div v-if="!disable" class="button_container">
      <s-button
        class="rounded primary"
        :icon="submitButton.icon"
        @click="submitForm"
      >
        {{ submitButton.text }}</s-button
      >
    </div>
  </div>
</template>

<script>
import SButton from "@/components/SButton";
export default {
  name: "Form",
  components: {
    SButton
  },
  props: {
    displayReset: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    disableForm: {
      type: Boolean,
      default: false
    },
    disable: {
      type: Boolean,
      default: false
    },
    headings: {
      type: Object,
      default: () => {
        return {};
      }
    },
    submitButton: {
      type: Object,
      default: () => {
        return {
          text: "Submit",
          plain: false,
          type: "primary",
          size: "mini"
        };
      }
    },
    config: {
      type: Array,
      default: () => [],
      required: false
    },
    allOptional: {
      type: Boolean,
      default: false
    },
    customMethod: {
      type: Function,
      default: null
    },

    emitOnChange: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: "mini"
    }
  },
  data() {
    return {
      formContent: {}
    };
  },
  computed: {
    form() {
      let validate = {};
      let form = [...this.config];
      for (let i = 0, len = form.length; i < len; i++) {
        let formItem = form[i];
        let formItemName = formItem?.name ?? formItem.model;

        if (!formItem?.optional && !this.allOptional && !formItem?.disabled) {
          let validArr = [];
          let compType = formItem["component-type"];
          let inputType = formItem["input-type"];
          let trigger = "blur",
            type;
          if (compType == "date-picker" || compType == "select") {
            trigger = "change";
          }

          if (
            (compType == "select" && formItem?.multiple) ||
            inputType == "dates" ||
            formItem?.isRange ||
            inputType == "date-time-range"
          ) {
            type = "array";
          } else if (compType == "select" && formItem?.validType == "number") {
            type = "number";
          }

          if (inputType == "date-time" || inputType == "date") {
            type = "date";
          }

          let validObj = {
            required: true,
            trigger,
            message: "Please fill in the following",
            name: formItemName,
            type
          };

          if (!formItem?.name) {
            formItem.name = formItem.model;
          }

          validArr.push(validObj);

          validate[formItem.name] = validArr;
        }
      }
      return {
        formData: this.config,
        validate
      };
    }
  },
  watch: {
    formContent: {
      deep: true,
      handler(val) {
        if (this.emitOnChange) {
          this.$emit("change", val);
        }
      }
    }
  },

  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    runValidation() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
          if (valid) {
            resolve(valid);
          } else {
            reject(false);
          }
        });
      });
    },
    completeForm() {
      this.$emit("val", this.formContent);
      this.formContent = {};
      if (this.customMethod) {
        this.customMethod();
      }

      if (this.nextTab) {
        this.$emit("changeTab");
      }
    },
    submitForm() {
      this.runValidation()
        .then(() => {
          this.completeForm();
        })
        .catch(error => {
          return error;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.form_wrapper {
  &.full_width {
    width: 100%;
    .dialog_item {
      max-width: 100%;
    }
    .el-button {
      width: 100%;
    }
  }
  .dialog_item {
    min-width: 70%;
    max-width: 70%;
  }
}
.form {
  padding: 20px;
}
.button_container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-top: 20px;
  position: relative;
  padding: 20px;
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgb(240, 240, 240);
    height: 1px;
  }
}
.button_text {
  text-transform: capitalize;
}

.description {
  color: #999;
  display: block;
  margin: 0;
  padding: 0;
}
.form_item_heading {
  p {
    margin: 0;
  }
}
</style>
