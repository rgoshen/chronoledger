import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.yarn/**',
      '**/.pnp.*',
    ],
  },

  js.configs.recommended,

  // TypeScript-ready rules (non type-aware). When you add tsconfig.json later,
  // we can upgrade to type-aware linting.
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // Disable ESLint rules that conflict with Prettier formatting
  prettierConfig,
];
