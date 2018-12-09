module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }],
    'linebreak-style': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'always-multiline',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'global-require': 'off'
  }
};
