module.exports = {
    clearMocks: true,
    modulePathIgnorePatterns: ['<rootDir>/src/'],
    setupFilesAfterEnv: ['./test/config/setup.js'],
    collectCoverageFrom: [
        '**/src/**',
        '!**/src/database/**',
        '!**/src/aws/**',
        '!**/node_modules/**',
        '!**/cdk/**'
    ]
};
