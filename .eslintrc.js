module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      /*
       * Jest injects its globals (`jest`, `describe`, `it`, `expect`) at run
       * time rather than through imports. Without declaring the env for these
       * files, `npm run lint` fails with 8 `no-undef` errors in jest.setup.js
       * before it evaluates a single line of application code.
       */
      files: ['jest.setup.js', 'jest.config.js', '__tests__/**/*', '**/*.test.{ts,tsx,js,jsx}'],
      env: { jest: true, node: true },
    },
  ],
};
