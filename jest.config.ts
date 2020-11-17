module.exports = {
    roots: ['<rootDir>/resources/ts/'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    setupFilesAfterEnv: [
        // '@testing-library/react/cleanup-after-each',
        '@testing-library/jest-dom/extend-expect',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    moduleNameMapper: {
        '^pages(.+)$': '<rootDir>/resources/ts/components/pages/$1',
        '^helpers(.+)$': '<rootDir>/resources/ts/components/helpers/$1',
        '^modules(.+)$': '<rootDir>/resources/ts/components/modules/$1',
        '^hooks(.+)$': '<rootDir>/resources/ts/hooks/$1',
        '^types(.+)$': '<rootDir>/resources/ts/types/$1',
        '^actions$': '<rootDir>/resources/ts/data/actions.ts',
    },
};
