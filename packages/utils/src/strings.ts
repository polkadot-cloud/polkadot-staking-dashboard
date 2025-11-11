// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Convert a string to kebab-case (lowercase with dashes for spaces)
export const kebabize = (str: string): string =>
	str
		.replace(/([a-z])([A-Z])/g, '$1-$2') // Add dash between camelCase
		.replace(/[\s_]+/g, '-') // Replace spaces and underscores with dashes
		.toLowerCase() // Convert to lowercase
		.replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
