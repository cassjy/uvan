// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  extends: ["plugin:vue/essential", "standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    browser: true
  },
  // required to lint *.vue files
  plugins: ["html"],
  // add your custom rules here
  rules: {
    // allow async-await
    // 'generator-star-spacing': 'off',
    // // allow debugger during development
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 'no-console': 'off',
    // 'indent': ['error', 4],
    // "quotes": 0,
    // "semi": 0,
    // "arrow-parens": 0,
    // "block-spacing": "never"
  }
};
