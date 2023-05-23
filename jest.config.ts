export default {
	clearMocks: true,
  // collectCoverage: true,
  coverageDirectory: "coverage",
	coverageProvider: 'v8',
	preset: 'ts-jest',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testMatch: ['<rootDir>/src/**/*.test.ts'],
	transform: { '^.+\\.ts?$': ['ts-jest', { isolatedModules: true }] },
};
