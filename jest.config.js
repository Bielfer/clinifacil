const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './src',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>src/components/$1',
    '^@/pages/(.*)$': '<rootDir>src/pages/$1',
    '^@/styles/(.*)$': '<rootDir>src/styles/$1',
    '^@/utils/(.*)$': '<rootDir>src/utils/$1',
    '^@/hooks/(.*)$': '<rootDir>src/hooks/$1',
    '^@/helpers/(.*)$': '<rootDir>src/helpers/$1',
    '^@/constants/(.*)$': '<rootDir>src/constants/$1',
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
