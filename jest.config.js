module.exports = {
  preset: 'ts-jest',
  rootDir: 'src',
  setupFilesAfterEnv: [require.resolve('./test/jest.setup.js')],
  testEnvironment: 'node',
  verbose: true,
};
