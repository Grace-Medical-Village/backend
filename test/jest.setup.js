module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,ts}'],
  preset: "ts-jest",
  rootDir: "src",
  setupFilesAfterEnv:
    [
      require.resolve("./setup-console.js"),
      require.resolve("./setup-env.js")
    ],
  testEnvironment: "node",
  verbose: true
};
