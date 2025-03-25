import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

import importExtensions from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    ignores: ['**/eslint.config.mjs', '.prettierrc.mjs', 'index.js']
  },
  ...fixupConfigRules(compat.extends('eslint:recommended', 'plugin:prettier/recommended', 'prettier')),
  {
    plugins: {
      'import-extensions': importExtensions,
      prettier: fixupPluginRules(prettier)
    },

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },

    rules: {
      ...importExtensions.configs.recommended.rules,

      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  }
];
