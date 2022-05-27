module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended', 'plugin:react/jsx-runtime'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 13,
    sourceType: 'module'
  },
  plugins: ['react', 'prettier'],
  rules: {
    'no-shadow': 'warn',
    'no-unused-vars': 'warn',
    'import/prefer-default-export': 'warn',
    'array-callback-return': 'warn',
    'consistent-return': 'warn',
    'react/forbid-prop-types': 'warn',
    'no-param-reassign': 'warn',
    'import/no-relative-packages': 'off',
    'import/no-unresolved': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'for-direction': 'off',
    'no-plusplus': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function'
      }
    ]
  }
};
