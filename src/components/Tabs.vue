<template>
  <div class="tabs_container pt-4 pb-4">
    <slot name="header_content"></slot>
    <el-tabs
      :closable="false"
      stretch
      :addable="false"
      v-model="tabChange"
      :tab-position="position"
      v-loading="loading"
      type="card"
    >
      <slot name="body_content"></slot>
      <el-tab-pane
        class="p-4"
        v-for="(tab, index) in tabs"
        :disabled="tab.disabled"
        :label="tab.label"
        :key="index"
      >
        <!-- Form component -->

        <Form
          @val="$emit('val', $event)"
          :customMethod="customMethod"
          :disable="disable"
          :disableForm="disableForm"
          v-if="tab.hasOwnProperty('formContent')"
          :config="tab.formContent"
          :submitText="submitText"
        />
        <div v-else>
          <component
            :is="tab.view.component"
            v-bind="tab.view.props"
            @conponentChanges="emitComponentData"
          />
        </div>

        <!--  Footer -->
        <slot name="footer_content"></slot>
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

    tabType: {
      type: String,
      default: "card"
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
  methods: {
    emitComponentData(e) {
      this.$emit(e.eventname, e.eventdata);
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
