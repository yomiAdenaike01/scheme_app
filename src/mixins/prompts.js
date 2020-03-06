export default {
  methods: {
    notify(type, title, content) {
      this.$notify({
        title: title,
        message: content,
        type: type
      });
    },
    alert(title, content) {},
    message(title, content, confirm) {
      return this.$confirm(content, title, {
        // distinguishCancelAndClose: true,
        confirmButtonText: confirm,
        cancelButtonText: "Cancel"
      });
    }
  }
};
