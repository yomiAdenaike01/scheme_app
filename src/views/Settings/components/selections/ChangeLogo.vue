<template>
  <div class="change_logo_container">
    <ToggleSlideDown title="Change Company Logo" :center="false">
      <ClientImage :image="fileContent" :showClient="false" />
      <UploadFile tip="" @fileContent="setFileContent" />
    </ToggleSlideDown>
  </div>
</template>

<script>
import ClientImage from "@/components/ClientImage";
import UploadFile from "@/components/UploadFile";
import uploadContent from "@/mixins/uploadContent";
import ToggleSlideDown from "@/components/ToggleSlideDown";
import Title from "@/components/Title";

export default {
  name: "ChangeLogo",
  data() {
    return {
      fileContent: ""
    };
  },
  mixins: [uploadContent],
  components: {
    ClientImage,
    UploadFile,
    ToggleSlideDown
  },
  methods: {
    setFileContent(e) {
      this.fileContent = e;
    }
  }
};
</script>

<style></style>
