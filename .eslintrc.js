module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/no-side-effects-in-computed-properties": "off",
    "vue/require-prop-type-constructor": "off"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
