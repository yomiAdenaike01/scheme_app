import { mapActions } from "vuex";

export default {
  data() {
    return {
      validFile: null,
      isValid: false
    };
  },
  methods: {
    ...mapActions(["request"]),
    validateFile(schema, fileToUpload, requestBody) {
      for (let i = 0; i < len; i++) {
        const fileToUploadElem = fileToUpload[i];
        const eventKeys = Object.keys(fileToUploadElem);
        const validationKeys = Object.keys(schema);
        const eventKeysLen = eventKeys.length;

        for (let j = 0; j < eventKeysLen; j++) {
          const eventKey = eventKeys[j];
          const validationKey = validationKeys[j];
          if (!validationKey || validationKey != eventKey) {
            this.isValid = false;
            break;
          } else {
            this.isValid = true;
            break;
          }
        }
      }
      if (this.isValid) {
        return this.uploadFile(file, requestBody);
      } else {
        return false;
      }
    },
    uploadFile(file, requestBody) {
      requestBody.data = {
        file
      };
      return window.console.log(requestBody);
      return this.request(requestBody)
        .then(response => {
          return true;
        })
        .catch(error => {
          return false;
        });
    }
  }
};
