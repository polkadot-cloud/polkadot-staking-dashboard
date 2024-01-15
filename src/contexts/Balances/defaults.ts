// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  defaultActiveBalance,
  defaultLedger,
} from 'static/BalancesController/defaults';
import type { BalancesContextInterface } from './types';
import BigNumber from 'bignumber.js';

export const defaultBalancesContext: BalancesContextInterface = {
  activeBalances: {},
  getNonce: (address) => 0,
  getBalanceLocks: (address) => ({ locks: [], maxLock: new BigNumber(0) }),
  getActiveBalance: (address) => defaultActiveBalance,
  getActiveStashLedger: (address) => defaultLedger,
  balancesSynced: false,
};
