module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
  extends: [
    'airbnb-typescript',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    browser: true,
    node: true,
  },
  settings: {
    'import/core-modules': ['electron'],
  },
  rules: {
    'no-console': 'off',
    'global-require': 'off',
    'import/no-named-as-default': 'off',
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: ['*.config.ts'],
    }],
    'react/jsx-props-no-spreading': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
  },
};
