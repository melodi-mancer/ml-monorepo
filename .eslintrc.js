module.exports = {
  'root': true,
  'env': {
    'es2021': true,
    'node': true,
    'mocha': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  'overrides': [],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module'
  },
  'plugins': [
    '@typescript-eslint'
  ],
  'ignorePatterns': ['dist/**/*', '**/*.test.*', '**/*.spec.*'],
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'max-len': [
      'error',
      { code: 80, tabsWidth: 2 }
    ]
  }
}