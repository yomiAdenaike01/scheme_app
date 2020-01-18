<template>
  <div class="create_shift_options_container">
    <!-- Displaying templates -->
    <ToggleSlideDown title="Select template">
      <div class="template_container">
        <div v-if="templates.length > 0">
          <ShiftTemplate v-for="template in templates" :key="template._id" :data="template" />
        </div>
        <p>No template found, press more information for find out more.</p>
        <!-- More help -->
        <div class="flex_center mt-3">
          <MoreInformation index="admin" instruction="create_template" />
        </div>
      </div>
    </ToggleSlideDown>
    <!-- Upload content -->
    <ToggleSlideDown title="Upload">
      <div class="upload_file_container columns">
        <Title
          defaultClass="m-0"
          subtitle="Select only CSV files that must have the following rows:"
        />
        <p v-for="(configElem,index) in shiftConfig" :key="index">{{configElem}}</p>
        <UploadFile
          readMethod="readAsText"
          @fileContent="$emit('conponentChanges',{eventname:'uploadFileContent',eventdata:$event})"
          class="mt-3"
          :buttonConfig="{text:'Select CSV File',round:true,icon:'el-icon-top',size:'small',type:'primary'}"
        />
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

<style>
</style>