// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import BigNumber from 'bignumber.js'
import type { Balance, Ledger } from 'contexts/Balances/types'
import type { PayeeConfig } from 'contexts/Setup/types'
import type { Nominations } from 'types'

export const defaultBalance: Balance = {
  free: new BigNumber(0),
  reserved: new BigNumber(0),
  frozen: new BigNumber(0),
}

export const defaultLedger: Ledger = {
  stash: null,
  active: new BigNumber(0),
  total: new BigNumber(0),
  unlocking: [],
}

export const defaultPayee: PayeeConfig = {
  destination: 'Staked',
  account: null,
}

export const defaultNominations: Nominations = {
  targets: [],
  submittedIn: 0,
}
