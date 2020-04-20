export default {
  methods: {
    scrollToBottom(element) {
      if (element) {
        element.scrollTop = element.scrollHeight;
      } else {
        console.error("Failed to perform scroll to bottom on element", element);
      }
    }
  }
};
