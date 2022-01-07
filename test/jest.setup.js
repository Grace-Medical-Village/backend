module.exports = {
  preset: "ts-jest",
  rootDir: "src",
  setupFilesAfterEnv: [require.resolve("./setup-env.js")],
  testEnvironment: "node",
  verbose: true
};
