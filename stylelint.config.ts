import type { Config } from 'stylelint'

export default {
	extends: ['stylelint-config-standard-scss'],
	plugins: ['stylelint-order'],
	customSyntax: 'postcss-scss',
	rules: {
		'order/order': ['custom-properties', 'declarations'],
		'selector-pseudo-class-no-unknown': [
			true,
			{
				ignorePseudoClasses: ['global', 'local', 'export'],
			},
		],
		'scss/at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: ['use'],
			},
		],
		'selector-class-pattern': null,
		'keyframes-name-pattern': null,
		'no-descending-specificity': null,
	},
} satisfies Config
