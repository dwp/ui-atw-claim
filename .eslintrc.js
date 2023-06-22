module.exports = {
  root: true,
  extends: ['@dwp/eslint-config-base'],
  parserOptions: {
    ecmaVersion: '2020',
  },
  plugins: [
    'unicorn',
  ],
  env: {
    browser: true,
    node: true,
    mocha: true,
  },
  rules: {
    'unicorn/filename-case': [
      'error',
      {
        case: 'kebabCase',
      },
    ],
  },
};
