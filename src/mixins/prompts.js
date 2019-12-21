export default {
  methods: {
    notify(success, title, content) {
      this.$notify[success]({
        title: title,
        message: content
      })
    },
    alert(title, content) {},
    message(title, content, confirm) {
      return this.$confirm(content, title, {
        // distinguishCancelAndClose: true,
        confirmButtonText: confirm,
        cancelButtonText: 'Cancel'
      })
    }
  }
}
