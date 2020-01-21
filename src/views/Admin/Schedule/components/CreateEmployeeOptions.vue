<template>
  <div class="employee_options">
    <ToggleSlideDown title="Upload Employee">
      <MoreInformation slot="titleContent" index="admin" instruction="upload_employee" />
      <UploadFile
        @removeContent="$emit('conponentChanges',{eventname:'removeContent',eventdata:null})"
        readMethod="readAsText"
        @fileContent="$emit('conponentChanges',{eventname:'fileContent',eventdata:$event})"
      />
    </ToggleSlideDown>
  </div>
</template>

<script>
import ToggleSlideDown from "@/components/ToggleSlideDown";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
import MoreInformation from "@/components/MoreInformation";
export default {
  name: "CreateEmployeeOptions",
  mixins: [uploadContent],
  components: {
    ToggleSlideDown,
    UploadFile,
    MoreInformation
  }
};
</script>

<style>
</style>