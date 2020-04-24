<template>
  <div class="tabs_container">
    <slot name="header"></slot>

    <el-tabs
      v-model="tabChange"
      v-loading="loading"
      :closable="false"
      stretch
      type="card"
      :addable="false"
      :tab-position="position"
    >
      <div v-if="$slots.body" class="tabs_body">
        <slot name="body"></slot>
      </div>
      <el-tab-pane
        v-for="(tab, index) in tabs"
        :key="index"
        :disabled="tab.disabled"
        :label="tab.label"
        class="tabs_body"
      >
        <!-- Form component -->
        <Form
          v-if="tab.hasOwnProperty('formContent')"
          :custom-method="customMethod"
          :disable="disable"
          :disable-form="disableForm"
          :config="tab.formContent"
          :submit-text="submitText"
          :emit-on-change="tab.emitOnChange"
          :display-reset="tab.displayReset"
          @val="$emit('val', $event)"
          @formValChange="$emit('formValChange', $event)"
        />
        <div v-else>
          <component
            :is="tab.view.component"
            v-bind="tab.view.props"
            @componentEmit="emitComponentData"
          />
        </div>
        <!--  Footer -->
        <div v-if="$slots.footer" class="tabs_body">
          <slot name="footer"></slot>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Form from "./Form";
export default {
  name: "Tabs",
  components: {
    Form
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
      type: String | Number,
      default: 0
    },
    customMethod: {
      type: Function
    },
    submitText: {
      type: String,
      default: "Submit"
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
        return this.selectedTab.toString();
      },
      set(val) {
        this.$emit("input", parseInt(val));
      }
    }
  },
  watch: {
    formContent(val) {
      if (this.liveChange) {
        this.$emit("val", val);
      }
    }
  },
  methods: {
    emitComponentData(e) {
      this.$emit(e.eventname, e.eventdata);
    }
  }
};
</script>
<style lang="scss" scoped>
.tabs_body {
  height: 100%;
  padding: 10px 20px;
}
</style>
