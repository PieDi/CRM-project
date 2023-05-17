module.exports = {
  root: true,
  extends: ['@vben'],
  overrides: [
    // {
    //   files: '*.vue',
    //   extends: ['@vue/typescript/recommended', 'plugin:vue/vue3-recommended', '@vue/typescript'],
    // },
    {
      files: ['*.vue', '*.js'],
      extends: ['plugin:vue/essential', '@vue/standard'],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
      },
      rules: {
        'vue/multi-word-component-names': 0,
        'vue/max-attributes-per-line': [
          2,
          {
            singleline: 20,
            multiline: 1,
          },
        ],
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        'vue/singleline-html-element-content-newline': 0,
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'vue/require-default-prop': 0,
        'vue/no-multiple-template-root': 0,
        'vue/no-lone-template': 0,
        'vue/no-v-model-argument': 0,
        'vue/one-component-per-file': 0,
        'import/no-cycle': 1,
        'no-trailing-space': 0,
        'space-before-function-paren': 0,
        'vue/html-self-closing': 0,
        quotes: [1, 'single'],
      },
    },
  ],
  // rules: {
  //   'no-console': 'off',
  //   'no-debugger': 'off',
  //   'no-irregular-whitespace': 'off', //这禁止掉 空格报错检查
  //   '@typescript-eslint/no-unused-vars': 'off',
  //   'vue/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  //   'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  // },
};
