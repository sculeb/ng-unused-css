module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		"@typescript-eslint/no-use-before-define": ["error", { "functions": false }],
		"@typescript-eslint/semi": [2, "never"],
		"@typescript-eslint/quotes": [2, "double"]
	}
};
