<template>
  <div @keyup.enter="submitForm">
    <el-form
      class="p-1"
      :inline="inline"
      :disabled="disableForm"
      ref="form"
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
              : input['component-type'] == 'time-picker'
              ? 'el-time-picker'
              : null
          "
          v-model="formContent[input.model]"
          :value-key="input.text || input.name"
          :show-password="input['component-type'] == 'password'"
          :min="input.min"
          :max="input.max"
          :picker-options="input.pickerOptions"
          range-separator="To"
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
          :disabled="input.disabled"
          :start-placeholder="input.start_placeholder"
          :end-placeholder="input.end_placeholder"
          :multiple="input.multiple"
          :clearable="true"
        >
          <el-option
            v-for="option in input.options"
            :label="option.text || option.name || option.label"
            :key="option.value"
            :value="option.value ? option.value : option.text"
          />
        </component>
        <!-- Hint -->
        <small
          class="description"
          v-if="input.hint"
          v-html="input.hint"
        ></small>
      </el-form-item>

      <!-- Submit button -->
      <div class="button_container mt-4" v-if="!disable">
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
    displayReset: {
      type: Boolean,
      default: false
    },
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
      type: Array
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
    },
    size: {
      type: String,
      default: "mini"
    },
    resetOnSubmit: {
      type: Boolean,
      default: true
    }
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

        if (!formItem?.optional) {
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

          if (inputType == "date-time") {
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

      if (this.customMethod) {
        this.customMethod();
      }

      if (this.nextTab) {
        this.$emit("changeTab");
      }
    },
    submitForm() {
      this.runValidation()
        .then(response => {
          this.completeForm();
          if (this.resetOnSubmit) {
            this.resetForm();
          }
        })
        .catch(error => {
          return error;
        });
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
  min-width: 70%;
}
.description {
  display: block;
  padding: 0;
  margin: 0;
  color: #999;
}
</style>
