import js from '@eslint/js';
import globals from 'globals';
import security from 'eslint-plugin-security';

export default [
  {
    ignores: ['node_modules/**', 'coverage/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node
    },
    plugins: { security },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'security/detect-eval-with-expression': 'error',
      'security/detect-unsafe-regex': 'warn'
    }
  }
];