// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars */

import BigNumber from 'bignumber.js';
import type { TransferOptions, TransferOptionsContextInterface } from './types';

export const defaultTransferOptionsContext: TransferOptionsContextInterface = {
  getTransferOptions: (a) => defaultTransferOptions,
  setFeeReserveBalance: (r) => {},
  feeReserve: new BigNumber(0),
};

export const defaultTransferOptions: TransferOptions = {
  freeBalance: new BigNumber(0),
  transferrableBalance: new BigNumber(0),
  balanceTxFees: new BigNumber(0),
  edReserved: new BigNumber(0),
  nominate: {
    active: new BigNumber(0),
    totalUnlocking: new BigNumber(0),
    totalUnlocked: new BigNumber(0),
    totalPossibleBond: new BigNumber(0),
    totalAdditionalBond: new BigNumber(0),
    totalUnlockChunks: 0,
  },
  pool: {
    active: new BigNumber(0),
    totalUnlocking: new BigNumber(0),
    totalUnlocked: new BigNumber(0),
    totalPossibleBond: new BigNumber(0),
    totalUnlockChunks: 0,
  },
};
