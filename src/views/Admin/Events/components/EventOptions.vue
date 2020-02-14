<template>
  <div class="create_shift_options_container">
    <!-- Displaying templates -->
    <ToggleSlideDown title="Your saved templates" :center="false">
      <MoreInformation slot="titleContent" index="admin" instruction="create_template" />
      <div class="flex columns" v-if="templates.length > 0" v-loading="templateLoading">
        <el-input v-model="templateNamesSearch" placeholder="Seach Templates" size="mini"></el-input>

        <EventTemplate
          @deleteTemplate="deleteTemplate"
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
              @click="displayCreateTemplate = !displayCreateTemplate"
            >Create new template</el-button>
          </Nocontent>
        </div>
      </div>

      <!-- Create template -->
      <el-collapse-transition>
        <CreateTemplate v-if="displayCreateTemplate" @toggle="displayCreateTemplate = false" />
      </el-collapse-transition>
    </ToggleSlideDown>

    <!-- Upload content -->
    <ToggleSlideDown title="Upload new timesheet">
      <MoreInformation slot="titleContent" index="admin" instruction="upload_timesheet" />

      <div class="upload_file_container columns">
        <Title
          defaultClass="m-0"
          subtitle="Select only CSV files that must have the following rows:"
        />

        <div class="flex_center">
          <UploadFile
            readMethod="readAsText"
            @removeContent="$emit('conponentChanges',{eventname:'removeContent',eventdata:null})"
            @fileContent="$emit('conponentChanges',{eventname:'uploadFileContent',eventdata:$event})"
            :buttonConfig="{text:'Select CSV File',round:true,icon:'el-icon-top',size:'small',type:'primary'}"
          />
        </div>
      </div>
    </ToggleSlideDown>
    <div class="template_container"></div>
  </div>
</template>

<script>
import ToggleSlideDown from "@/components/ToggleSlideDown";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
import Title from "@/components/Title";
import EventTemplate from "./EventTemplate";
import MoreInformation from "@/components/MoreInformation";
import { mapState, mapActions } from "vuex";
import Nocontent from "@/components/Nocontent";
import CreateTemplate from "./CreateTemplate";
export default {
  name: "CreateShiftOptions",
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
  mixins: [uploadContent],
  computed: {
    ...mapState(["userInformation"]),
    noTemplateOptions() {
      return {
        text: "No templates found, press more information for find out more.",
        icon: "el-icon-plus"
      };
    },
    shiftConfig() {
      return ["name", "assignedTo", "startDate", "endDate", "type"];
    }
  },
  methods: {
    ...mapActions(["request"]),
    async getTemplates() {
      try {
        this.templates = await this.request({
          method: "GET",
          url: "templates/all"
        });
        this.loadingTemplates = false;
      } catch (error) {
        this.loadingTemplates = false;
      }
    },
    async deleteTemplate({ id, elem }) {
      try {
        this.templateLoading = true;
        let deleteRequest = await this.request({
          method: "DELETE",
          url: "templates/delete",
          data: { id }
        });
        await this.getTemplates();
      } catch (error) {
        this.templateLoading = false;
      }
    }
  },
  components: {
    ToggleSlideDown,
    UploadFile,
    Title,
    EventTemplate,
    MoreInformation,
    Nocontent,
    CreateTemplate
  }
};
</script>