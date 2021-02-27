module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  extends: ['airbnb-typescript', 'plugin:react/recommended'],
  rules: {
    'react/display-name': 0,
    'react/jsx-props-no-spreading': 0,
    'react/prop-types': 0,
    'import/prefer-default-export': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    // 'jsx-a11y/anchor-has-content': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'no-plusplus': 0,
    // 'linebreak-style': 0,
  },
  parserOptions: {
    project: './tsconfig.json',
  },
};
