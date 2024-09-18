module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: ['src/**/*.{ts,js}'], // Specify which files to collect coverage from
  coverageDirectory: 'coverage', // Directory to output coverage reports
  coverageReporters: ['text', 'lcov'], // Specify coverage reporters
};
