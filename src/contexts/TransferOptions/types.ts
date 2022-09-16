// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { MaybeAccount } from 'types';

export interface TransferOptionsContextInterface {
  getTransferOptions: (a: MaybeAccount) => TransferOptions;
}

export interface TransferOptions {
  freeBalance: BN;
  nominate: {
    active: BN;
    freeToUnbond: BN;
    totalUnlocking: BN;
    totalUnlocked: BN;
    totalPossibleBond: BN;
    totalUnlockChuncks: number;
  };
  pool: {
    active: BN;
    freeToUnbond: BN;
    totalUnlocking: BN;
    totalUnlocked: BN;
    totalPossibleBond: BN;
    totalUnlockChuncks: number;
  };
}
