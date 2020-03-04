export default {
  computed: {
    settings() {
      let mobileSettings = {
        drawer: "rtl",
        navigation: ""
      };
      let isMobile = this.$mq != "lg";
      if (isMobile) {
        mobileSettings.drawer = "btt";
      }
      return mobileSettings;
    }
  }
};
