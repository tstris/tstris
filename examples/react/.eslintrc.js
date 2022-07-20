module.exports = {
	extends: ['tstris', 'next/core-web-vitals'],
	root: false,
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		tsconfigRootDir: __dirname,
	},
};
