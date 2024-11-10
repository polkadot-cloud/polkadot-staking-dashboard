// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { MaybeAddress } from 'types';

export interface TransferOptionsContextInterface {
  getTransferOptions: (a: MaybeAddress) => TransferOptions;
  setFeeReserveBalance: (r: BigNumber) => void;
  feeReserve: BigNumber;
  getFeeReserve: (address: MaybeAddress) => BigNumber;
}

export interface TransferOptions {
  freeBalance: BigNumber;
  transferrableBalance: BigNumber;
  balanceTxFees: BigNumber;
  edReserved: BigNumber;
  nominate: {
    active: BigNumber;
    totalUnlocking: BigNumber;
    totalUnlocked: BigNumber;
    totalPossibleBond: BigNumber;
    totalAdditionalBond: BigNumber;
    totalUnlockChunks: number;
  };
  pool: {
    active: BigNumber;
    totalUnlocking: BigNumber;
    totalUnlocked: BigNumber;
    totalPossibleBond: BigNumber;
    totalUnlockChunks: number;
  };
}
