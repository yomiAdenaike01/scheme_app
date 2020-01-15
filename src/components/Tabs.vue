<template>
  <div class="form_container">
    <slot name="header_content"></slot>
    <el-tabs
      @tab-click="$emit('input', $event.label.toLowerCase())"
      :type="tabType"
      :closable="false"
      stretch
      :addable="false"
    >
      <el-tab-pane v-for="(tab, index) in tabs" :label="tab.label" :key="index">
        <el-form style="padding-top:1em" v-if="tab.hasOwnProperty('formContent')">
          <el-form-item v-for="(input, index) in tab.formContent" :key="index" :prop="input.name">
            <component
              :is="
                input.type == 'text' || input.type == 'password'
                  ? 'el-input'
                  : input.type == 'select'
                  ? 'el-select'
                  : 'el-date-picker'
              "
              :placeholder="input.placeholder"
              v-model="formContent[input.model]"
              clearable
              :show-password="input.type == 'password'"
              :type="input.type == 'date' ? 'date' : null"
            >
              <el-option
                v-for="(option, index) in input.options"
                :key="index"
                :value="option.value ? option.value : option.text"
              >{{ option.text }}</el-option>
            </component>
          </el-form-item>
        </el-form>
        <div v-else>
          <component :is="tab.view.component" v-bind="tab.view.props" />
        </div>
        <!--  Footer -->
        <slot name="footer_content"></slot>
        <!-- Submit button -->
        <div class="button_container">
          <el-button
            size="small"
            type="primary"
            class="button_text"
            round
            @click="tab.formContent ? submitForm() : customMethod()"
          >{{ submitText }}</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  data() {
    return {
      formContent: {}
    };
  },
  props: {
    customMethod: {
      type: Function
    },
    submitText: {
      type: String,
      default: "Submit"
    },

    tabType: {
      type: String,
      default: "card"
    },
    tabs: {
      type: Array,
      required: true
    }
  },

  methods: {
    submitForm() {
      this.$emit("val", this.formContent);
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
</style>
