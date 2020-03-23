<template>
  <div class="upload_image_container">
    <el-upload
      action="/"
      :auto-upload="false"
      :on-change="emitFile"
      :limit="1"
      :on-remove="removeFileContent"
    >
      <el-button v-bind="buttonConfig">{{ buttonConfig.text }}</el-button>
      <p slot="tip" class="el-upload__tip">{{ tip }}</p>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: "UploadFile",
  props: {
    buttonConfig: {
      type: Object,
      default: () => {
        return {
          text: "Select Files",
          circle: false,
          round: true,
          type: "primary",
          icon: "el-icon-top",
          size: "small"
        };
      }
    },
    readMethod: {
      type: String,
      default: "readAsDataURL"
    },
    tip: {
      type: String,
      default: () => {
        return "Supported files *.csv, *.png , *.jpg";
      }
    }
  },
  data() {
    return {
      uploadFileSuccess: false
    };
  },

  methods: {
    removeFileContent() {
      this.$emit("removeContent", null);
    },
    emitFile(e) {
      let { raw } = e;
      let fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result) {
          this.uploadFileSuccess = true;
          this.$emit("fileContent", fileReader.result);
        }
      };
      fileReader[this.readMethod](raw);
    }
  }
};
</script>
