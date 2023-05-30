// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BigNumber from 'bignumber.js';
import type {
  PoolAddresses,
  PoolsConfigContextState,
  PoolStats,
} from 'contexts/Pools/types';

export const stats: PoolStats = {
  counterForPoolMembers: new BigNumber(0),
  counterForBondedPools: new BigNumber(0),
  counterForRewardPools: new BigNumber(0),
  lastPoolId: new BigNumber(0),
  maxPoolMembers: new BigNumber(0),
  maxPoolMembersPerPool: new BigNumber(0),
  maxPools: new BigNumber(0),
  minCreateBond: new BigNumber(0),
  minJoinBond: new BigNumber(0),
};

export const defaultPoolsConfigContext: PoolsConfigContextState = {
  addFavorite: () => {},
  removeFavorite: () => {},
  createAccounts: () => poolAddresses,
  favorites: [],
  stats,
  globalMaxCommission: 0,
};

export const poolAddresses: PoolAddresses = {
  stash: '',
  reward: '',
};
