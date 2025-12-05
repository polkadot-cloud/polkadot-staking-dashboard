// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveAccount, ActiveProxy } from 'types'

// Formats an ActiveAccount into the hook's `from` prop structure
export const formatFromProp = (
	account: ActiveAccount,
	proxy: ActiveProxy | null,
) => {
	return {
		address: account?.address || null,
		source: account?.source || null,
		proxy,
	}
}
