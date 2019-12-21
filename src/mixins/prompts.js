export default {
  methods: {
    notify(success, title, content) {
      this.$notify[success]({
        title: title,
        message: content
      })
    },
    alert(title, content) {},
    message(content) {}
  }
}
