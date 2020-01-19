<template>
  <div class="create_shift_options_container">
    <!-- Displaying templates -->
    <ToggleSlideDown title="Use saved template">
      <MoreInformation slot="titleContent" index="admin" instruction="create_template" />

      <div class="flex flex--space-between align-center mt-3">
        <div class="flex columns" v-if="templates.length > 0">
          <ShiftTemplate v-for="template in templates" :key="template._id" :data="template" />
        </div>
        <p>No template found, press more information for find out more.</p>
      </div>
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
import ShiftTemplate from "./ShiftTemplate";
import MoreInformation from "@/components/MoreInformation";
import { mapState } from "vuex";
export default {
  name: "CreateShiftOptions",
  data() {
    return {
      templates: ""
    };
  },
  activated() {
    this.request({
      method: "GET",
      url: "templates/all"
    })
      .then(response => {
        this.templates = response;
        this.loadingTemplates = false;
      })
      .catch(error => {
        this.loadingTemplates = false;
        return error;
      });
  },
  mixins: [uploadContent],
  computed: {
    ...mapState(["currentUser"]),
    shiftConfig() {
      return ["name", "assigned_to", "startDate", "endDate", "shift_type"];
    }
  },
  components: {
    ToggleSlideDown,
    UploadFile,
    Title,
    ShiftTemplate,
    MoreInformation
  }
};
</script>