/* eslint-disable */
export default {
	displayName: 'tstris-react',
	preset: '../../jest.preset.js',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.json',
		},
	},
	transform: {
		'^.+\\.[tj]s$': 'ts-jest',
	},
	moduleNameMapper: {
		'^@tstris/(.*)': '<rootDir>/../tstris-$1/src',
	},
	moduleFileExtensions: ['ts', 'js', 'html'],
	coverageDirectory: '../../coverage/packages/tstris-react',
};
