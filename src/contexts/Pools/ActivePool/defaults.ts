// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from 'bn.js';
import { MaybeAccount, Sync } from 'types';
import { ActiveBondedPool, ActivePoolContextState, PoolState } from '../types';

export const nominationStatus = {};

export const poolRoles = {
  depositor: '',
  nominator: '',
  root: '',
  stateToggler: '',
};

export const activeBondedPool: ActiveBondedPool = {
  id: 0,
  addresses: {
    stash: '',
    reward: '',
  },
  roles: poolRoles,
  unclaimedReward: new BN(0),
  memberCounter: '0',
  points: '0',
  state: PoolState.Open,
};

export const targets = {
  nominations: [],
};

export const poolNominations = {
  targets: [],
  submittedIn: 0,
};

export const poolBondOptions = {
  active: new BN(0),
  freeToBond: new BN(0),
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
  getPoolBondOptions: (a: MaybeAccount) => null,
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
