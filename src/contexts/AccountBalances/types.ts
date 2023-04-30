// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BigNumber from 'bignumber.js';

export type TransferOptionsContextInterface = null;

export interface AccountBalance {
  nonce?: number;
  address?: string;
  balance?: Balance;
  bonded?: string;
  locks?: Array<Lock>;
}

export interface Balance {
  free: BigNumber;
  reserved: BigNumber;
  miscFrozen: BigNumber;
  feeFrozen: BigNumber;
  freeAfterReserve: BigNumber;
}
