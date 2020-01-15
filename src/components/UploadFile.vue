<template>
  <div class="upload_image_container">
    <input type="file" @change="emitFile" />
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  data() {
    return {
      uploadFileSuccess: false
    };
  },
  methods: {
    emitFile(e) {
      let files = e.target.files[0];
      let fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          this.uploadFileSuccess = true;
          this.$emit("fileContent", fileReader.result);
        }
      };
      fileReader.readAsDataURL(files);
    }
  }
};
</script>

<style>
</style>