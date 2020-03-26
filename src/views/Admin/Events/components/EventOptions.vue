<template>
  <div class="p-4">
    <div
      v-if="eventTemplates.length > 0"
      v-loading="loading"
      class="flex columns"
    >
      <div class="flex_center input_container p-4">
        <el-input
          v-model="templateNamesSearch"
          placeholder="Seach Templates"
        ></el-input>
        <el-button
          size="small"
          class="ml-4"
          plain
          round
          @click="displayCreateTemplate = !displayCreateTemplate"
        >
          Create new template
          <i
            :class="{ active: displayCreateTemplate }"
            class="indicator el-icon-arrow-right"
          ></i>
        </el-button>
      </div>
      <transition-group name="el-fade-in">
        <EventTemplate
          v-for="template in filteredTemplates"
          :key="template._id"
          :data="template"
          @toggle="displayCreateTemplate = false"
        />
      </transition-group>
    </div>

    <!-- No templates -->
    <div v-else class="flex flex_center">
      <InformationDisplay
        mode="both"
        class="flex_center columns"
        :display-text="{
          tag: 'h2',
          class: 'extra_line_height',
          heading: 'Create a template',
          content:
            'You currently have no templates, you can hover over the help button above for more information on how to create templates and how they work.'
        }"
        :tutorial="{
          module: 'admin',
          feature: 'template_management',
          displayType: 'hover'
        }"
      >
        <div slot="body" class="flex_center">
          <el-button
            size="mini"
            @click="displayCreateTemplate = !displayCreateTemplate"
            >Create Template</el-button
          >
        </div>
      </InformationDisplay>
    </div>

    <!-- Create template -->
    <el-collapse-transition>
      <CreateTemplate
        v-if="displayCreateTemplate"
        @toggle="displayCreateTemplate = false"
      />
    </el-collapse-transition>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import EventTemplate from "./EventTemplate";
import CreateTemplate from "./CreateTemplate";
import EventModuleBus from "./EventsModuleBus";

import InformationDisplay from "@/components/InformationDisplay";
export default {
  name: "EventOptions",
  components: {
    EventTemplate,
    CreateTemplate,
    InformationDisplay
  },
  props: {
    templates: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      templateNamesSearch: "",
      loading: false,
      displayCreateTemplate: false
    };
  },
  computed: {
    ...mapState(["userInformation", "requestIntervals"]),
    ...mapState("Admin", ["eventTemplates"]),
    ...mapGetters(["getIsAdmin"]),

    filteredTemplates() {
      let filteredTemplates = [];
      for (let i = 0; i < this.eventTemplates.length; i++) {
        let { name } = this.eventTemplates[i];
        if (
          name.trim().toLowerCase() !=
          this.templateNamesSearch.trim().toLowerCase()
        ) {
          continue;
        }
        filteredTemplates.push(this.eventTemplates[i]);
      }
      return filteredTemplates.length == 0
        ? this.eventTemplates
        : filteredTemplates;
    },
    noTemplateOptions() {
      return {
        text: "No templates found, press more information for find out more.",
        icon: "el-icon-plus"
      };
    }
  },
  methods: {
    ...mapActions(["request"])
  }
};
</script>
<style lang="scss" scoped>
.indicator {
  transition: $default_transition;
  will-change: transform;
  &.active {
    transform: rotate(90deg);
  }
}
</style>
