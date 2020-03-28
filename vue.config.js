module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/Styles/defaults.scss";
        `
      }
    }
  },

  configureWebpack: {
    devServer: {
      disableHostCheck: true,
      overlay: {
        warnings: false,
        errors: false
      }
    }
  }
};
