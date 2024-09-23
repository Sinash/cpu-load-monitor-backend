module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/__test__/**/*.test.ts'],
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: ['src/**/*.{ts,js}'], // Specify which files to collect coverage from
  coverageDirectory: 'coverage', // Directory to output coverage reports
  coverageReporters: ['text', 'lcov'], // Specify coverage reporters
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
