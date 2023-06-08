// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';
import type { MaybeAccount } from 'types';

export interface TransferOptionsContextInterface {
  getTransferOptions: (a: MaybeAccount) => TransferOptions;
  setReserveBalance: (r: BigNumber) => void;
  reserve: BigNumber;
}

export interface TransferOptions {
  freeBalance: BigNumber;
  edReserved: BigNumber;
  nominate: {
    active: BigNumber;
    totalUnlocking: BigNumber;
    totalUnlocked: BigNumber;
    totalPossibleBond: BigNumber;
    totalAdditionalBond: BigNumber;
    totalUnlockChuncks: number;
  };
  pool: {
    active: BigNumber;
    totalUnlocking: BigNumber;
    totalUnlocked: BigNumber;
    totalPossibleBond: BigNumber;
    totalAdditionalBond: BigNumber;
    totalUnlockChuncks: number;
  };
}
