// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export const balance = {
  free: new BN(0),
  reserved: new BN(0),
  miscFrozen: new BN(0),
  feeFrozen: new BN(0),
  freeAfterReserve: new BN(0),
};

export const ledger = {
  stash: null,
  active: new BN(0),
  total: new BN(0),
  unlocking: [],
};

export const nominations = {
  targets: [],
  submittedIn: 0,
};

export const bondOptions = {
  freeToBond: new BN(0),
  freeToUnbond: new BN(0),
  totalUnlocking: new BN(0),
  totalUnlocked: new BN(0),
  totalPossibleBond: new BN(0),
  freeToStake: new BN(0),
  totalUnlockChuncks: 0,
};
