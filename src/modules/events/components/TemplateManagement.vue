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
          :type="displayCreateTemplate ? 'primary' : 'plain'"
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
      <TextDisplay
        :display-text="{
          tag: 'h2',
          class: 'extra_line_height',
          heading: 'Manage templates',
          content: 'Click the button below to get started creating templates'
        }"
      >
        <div slot="body">
          <el-button
            size="mini"
            :type="displayCreateTemplate ? 'primary' : 'plain'"
            @click="displayCreateTemplate = !displayCreateTemplate"
            >Toggle template form</el-button
          >
        </div>
      </TextDisplay>
    </div>

    <!-- Create template -->
    <CreateTemplate
      v-if="displayCreateTemplate"
      @toggle="displayCreateTemplate = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "TemplateManagement",
  components: {
    EventTemplate: () => import("./EventTemplate"),
    CreateTemplate: () => import("./CreateTemplate"),
    TextDisplay: () => import("@/components/TextDisplay")
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
    ...mapState("Events", ["eventTemplates"]),
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
