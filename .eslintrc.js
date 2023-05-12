module.exports = {
  root: true,
  extends: ['@vben'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-irregular-whitespace': 'off', //这禁止掉 空格报错检查
    '@typescript-eslint/no-unused-vars': 'off',
    'vue/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
