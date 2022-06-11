// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export const stats = {
  counterForPoolMembers: new BN(0),
  counterForBondedPools: new BN(0),
  counterForRewardPools: new BN(0),
  maxPoolMembers: new BN(0),
  maxPoolMembersPerPool: new BN(0),
  maxPools: new BN(0),
  minCreateBond: new BN(0),
  minJoinBond: new BN(0),
};

export const targets = {
  nominations: [],
};

export const nominations = {
  targets: [],
  submittedIn: 0,
};

export const poolMembership = null;

export const poolBondOptions = {
  active: new BN(0),
  freeToBond: 0,
  freeToUnbond: 0,
  totalUnlocking: 0,
  totalUnlocked: 0,
  totalUnlockChuncks: 0,
};

export const nominationStatus = {};
