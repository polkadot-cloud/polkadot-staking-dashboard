#!/usr/bin/env node
// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Test script to demonstrate CLI functionality without making actual API calls
// This shows the structure and flow of the CLI

console.log('=== Locale CLI Test Demo ===\n')

console.log('1. Basic usage:')
console.log(
	'   node packages/locale-cli/bin/add-locale.js --key myKey --text "My Text"\n',
)

console.log('2. With nested key:')
console.log(
	'   node packages/locale-cli/bin/add-locale.js --key "validators.commission" --text "Commission"\n',
)

console.log('3. With custom file:')
console.log(
	'   node packages/locale-cli/bin/add-locale.js --key myKey --text "My Text" --file help\n',
)

console.log('4. With description for better context:')
console.log(
	'   node packages/locale-cli/bin/add-locale.js --key bondMore --text "Bond More" --description "Button to bond additional funds"\n',
)

console.log('5. With API key option:')
console.log(
	'   node packages/locale-cli/bin/add-locale.js --key myKey --text "My Text" --api-key sk-...\n',
)

console.log(
	'Note: You need to set OPENAI_API_KEY environment variable or use --api-key option',
)
console.log('      to run the actual translation commands.\n')

console.log('Available locale files:')
console.log('  - app (default)')
console.log('  - help')
console.log('  - modals')
console.log('  - pages')
console.log('  - tips')

console.log('\nSupported languages:')
console.log('  - English (en)')
console.log('  - Spanish (es)')
console.log('  - Chinese Simplified (zh)')
