<template>
  <el-form class="p-1" :disabled="disableForm" :size="size">
    <el-form-item
      v-for="(input, index) in config"
      :key="index"
      :prop="input['name']"
      :label="input['label']"
    >
      <component
        class="dialog_item"
        :is="
                input['type'] == 'text' || input['type'] == 'password'
                  ? 'el-input'
                  : input['type'] == 'select'
                  ? 'el-select'
                  : 'el-date-picker'
              "
        v-model="formContent[input['model']]"
        :value-key="input['text'] || input['name']"
        :show-password="input['type'] == 'password'"
        :type="
                input['type'] == 'date'
                  ? 'date'
                  : input['type'] == 'date-time-range'
                  ? 'datetimerange'
                  : input.textarea
                  ? 'textarea'
                  : input['type'] == 'date-time'
                  ? 'datetime'
                  : null
              "
        v-bind="input"
        :required="input['required']"
        :disabled="input['disabled']"
        :start-placeholder="input['start_placeholder']"
        :end-placeholder="input['end_placeholder']"
        :multiple="input['multiple']"
        :clearable="input['clearable']"
      >
        <el-option
          v-for="option in input['options']"
          :label="option['text'] || option['name']"
          :key="option['value']"
          :value="
                  option['value']
                    ? option['value']
                    : option['text'] || option['name']
                "
        >{{ option["text"] || option["name"] }}</el-option>
      </component>
      <!-- Hint -->
      <small class="description" v-if="input['hint']" v-html="input['hint']"></small>
    </el-form-item>

    <!-- Submit button -->
    <div class="button_container mt-4" v-if="!disable">
      <el-button
        size="mini"
        type="primary"
        class="button_text"
        round
        @click="submitForm"
      >{{ submitText }}</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "Form",

  data() {
    return {
      formContent: {}
    };
  },
  props: {
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
    submitText: {
      type: String
    }
  },
  methods: {
    submitForm() {
      this.$emit("val", this.formContent);
      if (this.customMethod) {
        this.customMethod();
      }

      if (this.nextTab) {
        this.$emit("changeTab");
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