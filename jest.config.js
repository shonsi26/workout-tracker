module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'script.js'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  testMatch: [
    '**/*.test.js'
  ]
};
