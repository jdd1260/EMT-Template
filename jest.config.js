const tsPreset = require('ts-jest/jest-preset');
const mongoPreset = require('@shelf/jest-mongodb/jest-preset');

module.exports = {
  ...tsPreset,
  ...mongoPreset,
  testEnvironment: 'node',
  roots: ['src'],
  testPathIgnorePatterns: ['src/test-utils.test.ts'],
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
    '@types/(.*)': '<rootDir>/src/types/$1',
  },
};
