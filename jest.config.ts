module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jestConsoleSetup.ts'],
  testTimeout: 10000,
};
