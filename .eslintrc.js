module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'eslint-config-prettier',
  ],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'eslint-plugin-prettier',
    'simple-import-sort',
    'sort-keys-fix',
    'sort-class-members',
  ],
  root: true,
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    'arrow-body-style': [2, 'as-needed'],
    'arrow-parens': [2, 'always'],
    'import/order': 0,
    indent: [2, 2, { SwitchCase: 1 }],
    'max-len': [
      2,
      {
        code: 180,
        ignorePattern: '(^import|^export) (.*)',
      },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', next: 'function', prev: 'function' },
      { blankLine: 'always', next: 'class', prev: 'class' },
    ],
    'prefer-const': 2,
    'prettier/prettier': [
      'error',
      {
        printWidth: 100,
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    quotes: [2, 'single', { avoidEscape: true }],
    semi: [2, 'always', { omitLastInOneLineBlock: true }],
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Side effect imports.
          ['^\\u0000'],
          // Packages.
          // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
          ['^@?\\w'],
          ['^@apps'],
          // Absolute imports and other imports such as Vue-style `@/foo`.
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          // Anything that starts with a dot.
          ['^\\.'],
        ],
      },
    ],
    'sort-class-members/sort-class-members': [
      2,
      {
        accessorPairPositioning: 'getThenSet',
        order: [
          '[static-properties]',
          '[static-methods]',
          '[properties]',
          '[conventional-private-properties]',
          'constructor',
          '[methods]',
          '[conventional-private-methods]',
        ],
      },
    ],
    'sort-imports': 0,
    'sort-keys-fix/sort-keys-fix': 'error',
    'sort-vars': ['error'],
  },
};
