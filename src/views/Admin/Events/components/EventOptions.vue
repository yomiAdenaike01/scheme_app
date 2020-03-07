<template>
  <div class="create_shift_options_container p-4">
    <!-- Displaying templates -->
    <!-- <MoreInformation
      slot="titleContent"
      index="admin"
      instruction="create_template"
    /> -->
    <div
      class="flex columns"
      v-if="templates.length > 0"
      v-loading="templateLoading"
    >
      <div class="flex_center input_container p-4">
        <el-input
          v-model="templateNamesSearch"
          placeholder="Seach Templates"
          size="mini"
        ></el-input>
        <el-button
          size="mini"
          class="ml-4"
          type="text"
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
      <EventTemplate
        @toggle="displayCreateTemplate = false"
        v-for="template in templates"
        :key="template._id"
        :data="template"
      />
    </div>

    <!-- No templates -->
    <div v-else>
      <div class="flex_center">
        <Nocontent v-bind="noTemplateOptions">
          <el-button
            size="mini"
            class="ml-4"
            type="primary"
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
        </Nocontent>
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
import ToggleSlideDown from "@/components/ToggleSlideDown";
import Title from "@/components/Title";
import EventTemplate from "./EventTemplate";
import MoreInformation from "@/components/MoreInformation";
import { mapState, mapActions, mapGetters } from "vuex";
import Nocontent from "@/components/Nocontent";
import CreateTemplate from "./CreateTemplate";
export default {
  name: "EventOptions",
  data() {
    return {
      templates: "",
      templateNamesSearch: "",
      templateLoading: false,
      displayCreateTemplate: false
    };
  },

  async mounted() {
    await this.getTemplates();
  },
  computed: {
    ...mapState(["userInformation"]),
    ...mapGetters(["getIsAdmin"]),
    filteredTemplates() {
      let filteredTemplates = [];
      for (let i = 0; i < this.templates.length; i++) {
        let { name } = this.templates[i];
        if (
          name.trim().toLowerCase() !=
          this.templateNamesSearch.trim().toLowerCase()
        ) {
          continue;
        }
        filteredTemplates.push(this.templates[i]);
      }
      return filteredTemplates;
    },
    noTemplateOptions() {
      return {
        text: "No templates found, press more information for find out more.",
        icon: "el-icon-plus"
      };
    }
  },
  methods: {
    ...mapActions(["request"]),
    async getTemplates() {
      try {
        this.templates = await this.request({
          method: "GET",
          url: "events/templates/all"
        });
        this.loadingTemplates = false;
      } catch (error) {
        this.loadingTemplates = false;
      }
    }
  },
  components: {
    ToggleSlideDown,
    EventTemplate,
    MoreInformation,
    Nocontent,
    CreateTemplate
  }
};
</script>
<style lang="scss" scoped>
.indicator {
  will-transform: rotate;
  transition: $default_transition;
  &.active {
    transform: rotate(90deg);
  }
}
</style>
