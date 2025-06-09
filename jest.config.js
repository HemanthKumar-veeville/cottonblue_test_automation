module.exports = {
  preset: "jest-playwright-preset",
  testMatch: ["**/tests/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  testTimeout: 30000,
  maxWorkers: 1,
  reporters: ["default", ["./jest.reporter.js", {}]],
};
