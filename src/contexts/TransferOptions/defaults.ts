// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { TransferOptions, TransferOptionsContextInterface } from './types';

export const defaultBalancesContext: TransferOptionsContextInterface = {
  // eslint-disable-next-line
  getTransferOptions: (a) => transferOptions,
};

export const transferOptions: TransferOptions = {
  freeBalance: new BN(0),
  nominate: {
    freeToUnbond: new BN(0),
    totalUnlocking: new BN(0),
    totalUnlocked: new BN(0),
    totalPossibleBond: new BN(0),
    totalUnlockChuncks: 0,
  },
  pool: {
    active: new BN(0),
    freeToUnbond: new BN(0),
    totalUnlocking: new BN(0),
    totalUnlocked: new BN(0),
    totalPossibleBond: new BN(0),
    totalUnlockChuncks: 0,
  },
};
