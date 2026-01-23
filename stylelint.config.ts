import type { Config } from 'stylelint'

export default {
	extends: ['stylelint-config-standard-scss'],
	plugins: ['stylelint-order'],
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
		'scss/dollar-variable-pattern': null,
		'selector-class-pattern': null,
		'custom-property-pattern': null,
		'keyframes-name-pattern': null,
		'scss/at-import-partial-extension': null,
		'no-descending-specificity': null,
	},
} satisfies Config
