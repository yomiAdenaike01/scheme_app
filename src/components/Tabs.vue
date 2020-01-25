<template>
  <div class="tabs_container">
    <slot name="header_content"></slot>
    <el-tabs
      :closable="false"
      stretch
      :type="tabType"
      :addable="false"
      v-model="tabChange"
      :tab-position="position"
      v-loading="loading"
    >
      <slot name="body_content"></slot>
      <!-- Tabs -->
      <el-tab-pane class="p-3" v-for="(tab, index) in tabs" :label="tab['label']" :key="index">
        <span v-if="tab['renderTitle']" v-html="tab['renderTitle']" slot="label"></span>
        <el-form
          style="padding-top:1em"
          v-if="tab.hasOwnProperty('formContent')"
          :disabled="disableForm"
        >
          <el-form-item
            v-for="(input, index) in tab['formContent']"
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
              :type="input['type'] == 'date' ? 'date' : input['type'] == 'date-time' ? 'datetimerange' : input.textarea ? 'textarea' : null"
              v-bind="input"
              :required="input['required']"
              :disabled="input['disabled']"
              :start-placeholder="input['start_placeholder']"
              :end-placeholder="input['end_placeholder']"
              :multiple="input['multiple']"
            >
              <!-- Append and prepend for inputs -->
              <div slot="append" v-if="input['suffix']">
                <div v-html="input['suffix']"></div>
              </div>
              <div slot="prepend" v-if="input['prefix']">
                <div v-html="input['prefix']"></div>
              </div>

              <!-- Select options -->
              <el-option
                v-for="(option) in input['options']"
                :label="option['text'] || option['name']"
                :key="option['value']"
                :value="option['value'] ? option['value'] : option['text'] || option['name']"
              >{{ option['text'] || option['name'] }}</el-option>
            </component>

            <small class="description" v-if="input['hint']" v-html="input['hint']"></small>
          </el-form-item>
        </el-form>
        <div v-else>
          <component
            :is="tab['view']['component']"
            v-bind="tab['view']['props']"
            @conponentChanges="emitComponentData"
          />
        </div>
        <!--  Footer -->
        <slot name="footer_content"></slot>
        <!-- Submit button -->
        <div class="button_container mt-4" v-if="!disable">
          <el-button
            size="small"
            type="primary"
            class="button_text"
            round
            @click="submitForm"
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
    liveChange: Boolean,
    loading: {
      type: Boolean,
      default: false
    },
    nextTab: {
      type: Boolean,
      default: false
    },
    selectedTab: {
      type: String,
      default: "0"
    },
    customMethod: {
      type: Function
    },
    submitText: {
      type: String,
      default: "Submit"
    },

    tabType: {
      type: String,
      default: ""
    },
    tabs: {
      type: Array,
      required: true
    },
    disable: {
      type: Boolean,
      default: false
    },
    disableForm: {
      type: Boolean,
      default: false
    },
    position: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tabChange: {
      get() {
        return this.selectedTab;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  methods: {
    emitComponentData(e) {
      this.$emit(e.eventname, e.eventdata);
    },
    submitForm() {
      this.$emit("val", this.formContent);
      if (this.customMethod) {
        this.customMethod();
      }

      if (this.nextTab) {
        this.$emit("changeTab");
      }
    }
  },
  watch: {
    formContent(val) {
      if (this.liveChange) {
        this.$emit("val", val);
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
