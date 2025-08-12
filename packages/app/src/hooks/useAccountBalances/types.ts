// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js'
import type { AccountBalances, MaybeAddress } from 'types'

export interface TransferOptionsContextInterface {
	getAllBalances: (address: MaybeAddress) => AccountBalances
	getStakedBalance: (address: MaybeAddress) => BigNumber
}
