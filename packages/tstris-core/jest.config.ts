import type { InitialOptionsTsJest } from 'ts-jest/dist/types';

/* eslint-disable */
export default {
	displayName: 'tstris-core',
	preset: '../../jest.preset.js',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.json',
		},
	},
	transform: {
		'^.+\\.[tj]sx?$': 'ts-jest',
	},
	testEnvironment: 'node',
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
	coverageDirectory: '../../coverage/packages/tstris-core',
} as InitialOptionsTsJest;
