// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Get the initial active section
export const getPageFromUrl = (): string => {
	return window.location.hash.replace(/^#/, '').split('?')[0]
}
