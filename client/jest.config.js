const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const customJestConfig = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    collectCoverage: true,
    collectCoverageFrom: [
        'app/api/**/*.{ts,tsx}',
        'lib/services/**/*.{ts,tsx}',
        'lib/auth/**/*.{ts,tsx}',
        '!**/node_modules/**',
    ],
    coverageThreshold: { global: { statements: 90, branches: 80, functions: 85, lines: 90 } },
}

module.exports = createJestConfig(customJestConfig)