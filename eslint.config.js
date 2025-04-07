// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import pluginJs from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import path from 'path'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,ts,jsx,tsx}'],
  },
  {
    ignores: [
      '**/*.css',
      '**/*.scss',
      '**/*.lottie',
      '**/*.woff2',
      '**/*.svg',
      '**/*.png',
      '**/*.json',
      '**/*.log',
      '**/*.lock',
      '**/*.md',
      '**/*.ico',
      '**/*.ttf',
      '**/*.xml',
      '**/*.txt',
      '**/*.html',
      '**/*.cjs',
      '**/*.webmanifest',
      '**/LICENSE',
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/CHANGELOG.md',
      '**/.licenserc.json',
      '**/lottie/',
      '**/vite.config.ts',
      '**/_redirects',
      '**/*/pnpm-lock.yaml',
    ],
  },
  pluginJs.configs.recommended,
  importPlugin.flatConfigs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      react,
      'prefer-arrow-functions': preferArrowFunctions,
      'unused-imports': unusedImports,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: {
          defaultProject: 'tsconfig.json',
          allowDefaultProject: ['tsconfig.json', 'eslint.config.js'],
        },
        tsconfigRootDir: path.__dirname,
        overrides: [
          {
            files: ['eslint.config.js'],
            parserOptions: {
              project: null,
            },
          },
        ],
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['tsconfig.json', 'packages/*/tsconfig.json'],
        },
      },
    },
    rules: {
      // Prettier
      'prettier/prettier': [
        'error',
        {
          semi: false,
        },
      ],
      // Stylistic
      curly: 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],
      'object-shorthand': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],
      semi: ['error', 'never'],
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never',
        },
      ],
      // React
      // "@typescript-eslint/no-unnecessary-condition": "error", // in progress
      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.tsx'],
        },
      ],
      // Typescript
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-shadow': 'error',
    },
  },
]
