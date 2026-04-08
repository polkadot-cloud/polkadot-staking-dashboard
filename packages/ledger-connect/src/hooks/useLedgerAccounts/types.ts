// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { HardwareAccount } from '@w3ux/types'

export interface UseLedgerAccountsReturn {
	getLedgerAccounts: () => HardwareAccount[]
	getLedgerAccount: (address: string) => HardwareAccount | null
	addLedgerAccount: (
		group: number,
		address: string,
		index: number,
		callback?: () => void,
	) => HardwareAccount | null
	removeLedgerAccount: (address: string, callback?: () => void) => void
	renameLedgerAccount: (address: string, name: string) => void
	ledgerAccountExists: (address: string) => boolean
}
