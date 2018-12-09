module.exports = {
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'linebreak-style': 'off',
    'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: false }]
  }
};
