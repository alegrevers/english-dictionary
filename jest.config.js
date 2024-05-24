require('dotenv').config({
  path: '.env.test',
})

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'jest-environment-node',
  watchPathIgnorePatterns: ['globalConfig'],
  // setupFilesAfterEnv: [
  //   "./src/test/handlers.test.js"
  // ],
  detectOpenHandles: true,
  testTimeout: 5000,
}
