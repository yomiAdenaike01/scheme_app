module.exports = {
  root: false,

  env: {
    node: true
  },

  extends: ['plugin:vue/recommended'],

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    'vue/require-prop-type-constructor': 'off'
  },

  parserOptions: {
    parser: 'babel-eslint'
  },

  'extends': [
    'plugin:vue/essential'
  ]
};
