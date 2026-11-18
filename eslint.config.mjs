import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwrightPlugin from 'eslint-plugin-playwright';

export default [
  {
  ignores: [
    'allure-report/**',
    'allure-results/**',
    'playwright-report/**',
    'test-results/**',
    'eslint-report.json',
  ],
},
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      playwright: playwrightPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...playwrightPlugin.configs['flat/recommended'].rules,
      'playwright/expect-expect': 'off',
    },
  },
];
