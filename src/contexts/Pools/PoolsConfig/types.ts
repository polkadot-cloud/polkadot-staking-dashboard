// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { AnyApi } from '@polkadot-cloud/react/types';
import type BigNumber from 'bignumber.js';
import type { PoolAddresses } from '../BondedPools/types';

export interface PoolsConfigContextState {
  addFavorite: (a: string) => void;
  removeFavorite: (a: string) => void;
  createAccounts: (p: number) => PoolAddresses;
  favorites: string[];
  stats: PoolStats;
}

export interface PoolConfigState {
  stats: PoolStats;
  unsub: AnyApi;
}

export interface PoolStats {
  counterForPoolMembers: BigNumber;
  counterForBondedPools: BigNumber;
  counterForRewardPools: BigNumber;
  lastPoolId: BigNumber;
  maxPoolMembers: BigNumber | null;
  maxPoolMembersPerPool: BigNumber | null;
  maxPools: BigNumber | null;
  minCreateBond: BigNumber;
  minJoinBond: BigNumber;
  globalMaxCommission: number;
}
