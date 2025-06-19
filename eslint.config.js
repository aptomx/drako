const tsParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const globals = require('globals');
const js = require('@eslint/js');
const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  // Base recommended config
  js.configs.recommended,

  // JavaScript files (including config files)
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettier,
    },
    rules: {
      // Prettier integration for JS files
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },

  // TypeScript files only
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        Express: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      prettier: prettier,
    },
    rules: {
      // Recommended TypeScript rules
      ...typescriptEslintPlugin.configs.recommended.rules,

      // Custom rules from your original config
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'error',

      // Prettier integration
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
    },
  },

  // Ignore patterns
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
];
