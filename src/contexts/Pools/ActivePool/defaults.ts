// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { MaybeAccount, Sync } from 'types';
import { ActiveBondedPool, ActivePoolContextState } from '../types';

export const nominationStatus = {};

export const poolRoles = {
  depositor: '',
  nominator: '',
  root: '',
  stateToggler: '',
};

export const bondedPool = {
  points: '0',
  state: 'Blocked',
  memberCounter: '0',
  roles: null,
};

export const rewardPool = {
  lastRecordedRewardCounter: '0',
  lastRecordedTotalPayouts: '0',
  totalRewardsClaimed: '0',
};

export const activeBondedPool: ActiveBondedPool = {
  id: 0,
  addresses: {
    stash: '',
    reward: '',
  },
  bondedPool,
  rewardPool,
  rewardAccountBalance: {},
  unclaimedRewards: new BN(0),
};

export const targets = {
  nominations: [],
};

export const poolNominations = {
  targets: [],
  submittedIn: 0,
};

export const poolTransferOptions = {
  active: new BN(0),
  freeBalance: new BN(0),
  freeToUnbond: new BN(0),
  totalUnlocking: new BN(0),
  totalUnlocked: new BN(0),
  totalPossibleBond: new BN(0),
  totalUnlockChuncks: 0,
};

export const defaultActivePoolContext: ActivePoolContextState = {
  isBonding: () => false,
  isNominator: () => false,
  isOwner: () => false,
  isDepositor: () => false,
  isStateToggler: () => false,
  getPoolBondedAccount: () => null,
  // eslint-disable-next-line
  getPoolTransferOptions: (a: MaybeAccount) => null,
  getPoolUnlocking: () => [],
  getPoolRoles: () => poolRoles,
  // eslint-disable-next-line
  setTargets: (t) => {},
  getNominationsStatus: () => nominationStatus,
  activeBondedPool,
  targets,
  poolNominations,
  synced: Sync.Unsynced,
};
