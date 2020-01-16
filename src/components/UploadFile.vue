<template >
  <div class="upload_image_container mt-4">
    <el-upload action="/" :auto-upload="false" :on-change="emitFile" :limit="1">
      <el-button round type="primary" icon="el-icon-upload" :size="size">Select Files</el-button>
      <div class="txt_center el-upload__tip" slot="tip">{{tip}}</div>
    </el-upload>
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
  props: {
    size: {
      type: String,
      default: "medium"
    },
    readMethod: {
      type: String,
      default: "readAsDataURL"
    },
    tip: {
      type: String,
      default: () => {
        return "jpg/png files with a size less than 500kb";
      }
    }
  },

  methods: {
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

