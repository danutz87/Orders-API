export default {
  // if you're also using typescript
  testEnvironment: 'node',
  verbose: true,
  // registers babel.config.js with jest
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
