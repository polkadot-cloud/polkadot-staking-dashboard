// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js'
import {
  defaultBalance,
  defaultLedger,
  defaultPayee,
} from 'controllers/Balances/defaults'
import type { BalancesContextInterface } from './types'

export const defaultBalancesContext: BalancesContextInterface = {
  activeBalances: {},
  getNonce: (address) => 0,
  getLocks: (address) => ({ locks: [], maxLock: new BigNumber(0) }),
  getBalance: (address) => defaultBalance,
  getLedger: (source) => defaultLedger,
  getPayee: (address) => defaultPayee,
  getPoolMembership: (address) => null,
  getNominations: (address) => [],
  getEdReserved: (address, existentialDeposit) => new BigNumber(0),
}
