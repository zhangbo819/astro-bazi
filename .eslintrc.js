module.exports = {
  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',

    // ⭐ 必须放最后
    'plugin:prettier/recommended',
  ],

  rules: {
    // ❗ 不要写任何格式规则（quotes / semi 等）
  },
};
