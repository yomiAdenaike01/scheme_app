<template>
  <div class="employee_options">
    <ToggleSlideDown title="Upload Employee">
      <UploadFile
        @removeContent="
          $emit('conponentChanges', {
            eventname: 'removeContent',
            eventdata: null
          })
        "
        readMethod="readAsText"
        @fileContent="
          $emit('conponentChanges', {
            eventname: 'fileContent',
            eventdata: $event
          })
        "
      />
    </ToggleSlideDown>
  </div>
</template>

<script>
import ToggleSlideDown from "@/components/ToggleSlideDown";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
export default {
  name: "CreateUserOptions",
  mixins: [uploadContent],
  components: {
    ToggleSlideDown,
    UploadFile
  }
};
</script>

<style></style>
