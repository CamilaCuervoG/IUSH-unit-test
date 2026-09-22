/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text', 'html'],
  coverageThreshold: {
    global: { branches: 80, functions: 80, lines: 80, statements: 80 }
  }
};
