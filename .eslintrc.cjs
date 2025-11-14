module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'playwright'],
  root: true,
  rules: {
    '@typescript-eslint/no-floating-promises': 'error',
    'playwright/missing-playwright-await': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'playwright/expect-expect': 'off', // Page object methods contain assertions
  },
};
