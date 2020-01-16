<template>
  <div class="employee_options">
    <ToggleSlideDown title="Upload Employee">
      <UploadFile
        :buttonConfig="{circle:false, round:true, size:'small', text:'Select Files'}"
        @fileContent="$emit('fileContent',$event)"
      />
    </ToggleSlideDown>
  </div>
</template>

<script>
import ToggleSlideDown from "@/components/ToggleSlideDown";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
export default {
  name: "CreateEmployeeOptions",
  mixins: [uploadContent],
  components: {
    ToggleSlideDown,
    UploadFile
  }
};
</script>

<style>
</style>