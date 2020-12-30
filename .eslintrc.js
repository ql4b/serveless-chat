module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'standard',
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['node', 'prettier'],
  rules: {
    'require-atomic-updates': 1,
    'prettier/prettier': 'error',
  },
  overrides: [
    {
      files: ['*.spec.js', '*.test.js'],
      env: {
        jest: true,
      },
      extends: ['plugin:jest/recommended'],
      plugins: ['jest'],
      rules: {
        'node/no-unpublished-require': 0,
      },
    },
  ],
}
