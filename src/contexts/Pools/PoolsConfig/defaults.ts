// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

import BigNumber from 'bignumber.js';
import type { PoolsConfigContextState, PoolStats } from './types';
import type { PoolAddresses } from '../BondedPools/types';

export const defaultStats: PoolStats = {
  counterForPoolMembers: new BigNumber(0),
  counterForBondedPools: new BigNumber(0),
  counterForRewardPools: new BigNumber(0),
  lastPoolId: new BigNumber(0),
  maxPoolMembers: null,
  maxPoolMembersPerPool: null,
  maxPools: null,
  minCreateBond: new BigNumber(0),
  minJoinBond: new BigNumber(0),
  globalMaxCommission: 0,
};

export const defaultPoolsConfigContext: PoolsConfigContextState = {
  addFavorite: () => {},
  removeFavorite: () => {},
  createAccounts: () => poolAddresses,
  favorites: [],
  stats: defaultStats,
};

export const poolAddresses: PoolAddresses = {
  stash: '',
  reward: '',
};
