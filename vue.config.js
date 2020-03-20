module.exports = {
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
      disableHostCheck: true
    }
  },

  lintOnSave: false
};
