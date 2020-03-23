<template>
  <div @keyup.enter="submitForm">
    <slot name="header"></slot>
    <el-form
      ref="form"
      class="p-1"
      :inline="inline"
      :disabled="disableForm"
      :rules="form.validate"
      :model="formContent"
    >
      <el-form-item
        v-for="(input, index) in form.formData"
        :key="`${index}${input.name}`"
        :prop="input.name"
        :label="input.label || ''"
      >
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
              : input['component-type'] == 'cascader'
              ? 'el-cascader'
              : null
          "
          v-model="formContent[input.model]"
          class="dialog_item"
          :value-key="input.text || input.name"
          :show-password="input['component-type'] == 'password'"
          :min="input.min"
          :max="input.max"
          :option="input.options"
          :props="input.cascaderProps"
          :picker-options="input.pickerOptions"
          :is-range="input.isRange"
          :type="
            input['input-type'] == 'date'
              ? 'date'
              : input['input-type'] == 'date-time-range'
              ? 'datetimerange'
              : input.hasOwnProperty('textarea')
              ? 'textarea'
              : input['input-type'] == 'date-time'
              ? 'datetime'
              : input['input-type'] == 'dates'
              ? 'dates'
              : null
          "
          v-bind="input"
          :placeholder="
            input.optional
              ? `(Optional) ${input.placeholder}`
              : input.placeholder
          "
          :disabled="input.disabled"
          :start-placeholder="input.start_placeholder"
          :end-placeholder="input.end_placeholder"
          :multiple="input.multiple"
          :clearable="true"
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

      <!-- Submit button -->
      <div v-if="!disable" class="button_container mt-4">
        <el-button
          :size="size"
          type="primary"
          class="button_text"
          round
          @click="submitForm"
          >{{ submitText }}</el-button
        >
        <el-button v-if="displayReset" @click="resetForm">Reset</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Form",
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
    submitText: {
      type: String,
      default: "Submit"
    },
    config: {
      type: Array
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
    },
    resetOnSubmit: {
      type: Boolean,
      default: false
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
        let formItemName = formItem.hasOwnProperty("name")
          ? formItem.name
          : formItem.model;

        if (!formItem?.optional && !formItem?.disabled) {
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
          this.$emit("formValChange", val);
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
      return new Promise((resolve, reject) => {
        try {
          this.$emit("val", this.formContent);

          if (this.customMethod) {
            this.customMethod();
          }

          if (this.nextTab) {
            this.$emit("changeTab");
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    },
    submitForm() {
      this.runValidation()
        .then(response => {
          this.completeForm().then(response => {
            if (this.resetOnSubmit) {
              this.resetForm();
            }
          });
        })
        .catch(error => {
          return error;
        });
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
  min-width: 70%;
}
.description {
  display: block;
  padding: 0;
  margin: 0;
  color: #999;
}
</style>
