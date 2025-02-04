// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MaybeAddress } from 'types'

export interface BondedAccount {
  address?: string
  bonded?: string
}

export interface BondedContextInterface {
  getBondedAccount: (address: MaybeAddress) => string | null
  bondedAccounts: BondedAccount[]
}
