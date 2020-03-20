<template>
  <div class="create_shift_options_container p-4">
    <div
      class="flex columns"
      v-if="eventTemplates.length > 0"
      v-loading="loading"
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
          @toggle="displayCreateTemplate = false"
          v-for="template in filteredTemplates"
          :key="template._id"
          :data="template"
        />
      </transition-group>
    </div>

    <!-- No templates -->
    <div v-else>
      <div class="flex_center">
        <InformationDisplay mode='both' :displayText="{heading:'Heading',content:'Content'}" :tutorial="{module:'admin', feature:'template_management',displayType:'hover'}" />
      </div>
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

import InformationDisplay from '@/components/InformationDisplay'
export default {
  name: "EventOptions",
  data() {
    return {
      templateNamesSearch: "",
      loading: false,
      displayCreateTemplate: false
    };
  },
  props: {
    templates: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  components: {
    EventTemplate,
    CreateTemplate,
    InformationDisplay
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
  will-change: transform;
  transition: $default_transition;
  &.active {
    transform: rotate(90deg);
  }
}
</style>
