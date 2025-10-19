// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ActiveAccount, ImportedAccount, MaybeAddress } from 'types'

export interface ImportedAccountsContextInterface {
	accounts: ImportedAccount[]
	getAccount: (activeAccount: ActiveAccount) => ImportedAccount | null
	isReadOnlyAccount: (address: MaybeAddress) => boolean
	accountHasSigner: (activeAccount: ActiveAccount) => boolean
	requiresManualSign: (activeAccount: ActiveAccount) => boolean
	stringifiedAccountsKey: string
}
