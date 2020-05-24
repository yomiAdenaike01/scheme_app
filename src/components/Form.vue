<template>
  <div class="form_wrapper" @keyup.enter="submitForm">
    <header v-if="$slots.header">
      <slot name="header"></slot>
    </header>
    <div class="form">
      <div
        v-for="(input, index) in config"
        :key="`${index}${input.name}`"
        class="form_item"
      >
        <span v-if="input.label" class="form_item_label">
          {{
            input.optional || allOptional
              ? `(Optional) ${input.label}`
              : input.label
          }}
        </span>
        <p
          v-if="
            Object.values(headings).length > 0 &&
              headings.hasOwnProperty(input.model)
          "
          class="form_item_heading"
          v-html="headings[input.model]"
        ></p>
        <small
          v-if="
            Object.values(rules).length > 0 && rules.hasOwnProperty(input.model)
          "
          class="error_message"
          >* {{ rules[input.model] }}</small
        >

        <!-- NATIVE INPUTS -->

        <input
          v-if="inputTypes.indexOf(input.component_type) > -1"
          v-model="formContent[input.model]"
          :disabled="input.disabled"
          class="s_input"
          :placeholder="input.placeholder"
          :type="input.component_type"
          :class="[
            's_input',
            input.component_type,
            { input_error: rules.hasOwnProperty(input.model) }
          ]"
        />

        <select
          v-if="input.component_type == 'select'"
          v-model="formContent[input.model]"
          :class="[
            's_input',
            input.component_type,
            {
              multiple: input.multiple,
              input_error: rules.hasOwnProperty(input.model)
            }
          ]"
          :disabled="input.disabled"
          :multiple="input.multiple ? true : false"
        >
          <option class="first_option" disabled value=""
            >Please select...</option
          >

          <option
            v-for="(option, index) in input.options"
            :key="index"
            class="form_option"
            :value="option._id || option.value"
            >{{ option.text || option.name || option.label }}</option
          >
        </select>

        <textarea
          v-if="input.compoent_type == 'textarea'"
          v-model="formContent[input.model]"
          class="s_input"
        />
        <!-- DYNAMIC INPUTS -->

        <component
          :is="
            input.component_type == 'date-picker'
              ? 'el-date-picker'
              : input.component_type == 'time-picker'
              ? 'el-time-picker'
              : null
          "
          v-else
          v-model="formContent[input.model]"
          :class="[
            input.component_type,
            { input_error: rules.hasOwnProperty(input.model) }
          ]"
          :min="input.min"
          :max="input.max"
          :is-range="input.isRange"
          :type="
            input.input_type == 'date'
              ? 'date'
              : input.input_type == 'date-time-range'
              ? 'datetimerange'
              : input.input_type == 'date-time'
              ? 'datetime'
              : input.input_type == 'dates'
              ? 'dates'
              : null
          "
          :active-text="
            input.optional || allOptional
              ? `(Optional) ${input.placeholder}`
              : input.placeholder
          "
          :disabled="input.disabled"
          :start-placeholder="input.start_placeholder"
          :end-placeholder="input.end_placeholder"
        />

        <!-- Hint -->
        <small
          v-if="input.hint"
          class="description"
          v-html="input.hint"
        ></small>
      </div>

      <slot name="footer"></slot>
    </div>
    <!-- Submit button -->
    <div v-if="!disable" class="button_container">
      <s-button
        :class="submitButton.class ? submitButton.class : 'primary rounded'"
        :icon="submitButton.icon"
        @click="submitForm"
      >
        {{ submitButton.text }}</s-button
      >
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import SButton from "@/components/SButton";
export default {
  name: "Form",
  components: {
    SButton
  },
  model: {
    prop: "formContent",
    event: "input"
  },

  props: {
    formContent: {
      type: Object,
      default: () => {}
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
          text: "Submit"
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

    validations: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    inputTypes() {
      return ["text", "checkbox", "password"];
    },
    rules() {
      let validationsObject = {};
      for (let i = 0, len = this.validations.length; i < len; i++) {
        let validation = this.validations[i];

        if (
          !this.formContent[validation] ||
          this.formContent[validation].length == 0
        ) {
          validationsObject[validation] = "Please fill in the following";
        }
      }
      return validationsObject;
    }
  },
  created() {
    for (let i = 0, len = this.config.length; i < len; i++) {
      let item = this.config[i];
      if (item?.multiple) {
        this.$set(this.formContent, item.model, []);
      }
    }
  },
  methods: {
    ...mapMutations(["CREATE_SYSTEM_NOTIFICATION"]),
    selectProperties(input) {
      input = Object.assign({}, input);
      if (input?.multiple) {
        input.multiple = true;
      }
      delete input.options;

      return input;
    },
    submitForm() {
      if (Object.keys(this.rules).length == 0) {
        this.$emit("val");

        if (this.nextTab) {
          this.$emit("changeTab");
        }
      } else {
        this.CREATE_SYSTEM_NOTIFICATION({
          type: "error",
          message: `Failed to submit form missing fields <strong>${this.makePretty(
            Object.keys(this.rules).join(",")
          )}</strong>`
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  position: relative;
  &::after {
    position: absolute;
    content: "";
    bottom: 0;
    right: 0;
    left: 0;
    background: rgb(240, 240, 240);
    height: 1px;
  }
}
.form_wrapper {
  &.no_padding {
    padding: 0;
  }
}
.form {
  padding: 2%;
}
.form_item {
  padding: 10px 0;
}
.form_item_label {
  padding: 5px 0;
  margin: 0px;
  display: block;
}
.error_message {
  color: rgba(var(--danger), 1);
  display: block;
}
.button_container {
  display: flex;
  flex: 1;
  justify-content: space-between;
  margin-top: 20px;
  position: relative;
  padding: 20px;
  background: rgb(250, 250, 250);

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
.input_error {
  border: 1px solid rgba(var(--danger), 0.3);
}
.form_option {
  padding: 10px;
  transition: $default_transition;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;

  &:hover {
    background: rgb(250, 250, 250);
    cursor: pointer;
    transform: translateX(3px);
  }
  &:active {
    background: rgb(250, 250, 250);
  }
}
.first_option {
  padding: 15px;
  cursor: not-allowed;
}
</style>
