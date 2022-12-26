// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { AnyApi, AnyJson, AnyMetaBatch, MaybeAccount, Sync } from 'types';

// PoolsConfig types
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
  counterForPoolMembers: BN;
  counterForBondedPools: BN;
  counterForRewardPools: BN;
  lastPoolId: BN;
  maxPoolMembers: BN;
  maxPoolMembersPerPool: BN;
  maxPools: BN;
  minCreateBond: BN;
  minJoinBond: BN;
}

// PoolMemberships types
export interface PoolMembershipsContextState {
  memberships: Array<PoolMembership>;
  membership: PoolMembership | null;
}

export interface PoolMembership {
  address: string;
  poolId: number;
  points: string;
  lastRecordedRewardCounter: string;
  unbondingEras: { [key: number]: string };
  unlocking: Array<{
    era: number;
    value: BN;
  }>;
}

// BondedPool types
export interface BondedPoolsContextState {
  fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => void;
  queryBondedPool: (p: number) => any;
  getBondedPool: (p: number) => BondedPool | null;
  updateBondedPools: (p: Array<BondedPool>) => void;
  addToBondedPools: (p: BondedPool) => void;
  removeFromBondedPools: (p: number) => void;
  getPoolNominationStatus: (n: MaybeAccount, o: MaybeAccount) => any;
  getPoolNominationStatusCode: (t: NominationStatuses | null) => string;
  getAccountRoles: (w: MaybeAccount) => any;
  getAccountPools: (w: MaybeAccount) => any;
  replacePoolRoles: (poolId: number, roleEdits: AnyJson) => void;
  poolSearchFilter: (l: any, k: string, v: string) => void;
  bondedPools: Array<BondedPool>;
  meta: AnyMetaBatch;
}

export interface ActivePool {
  id: number;
  addresses: PoolAddresses;
  bondedPool: any;
  rewardPool: any;
  rewardAccountBalance: any;
  unclaimedRewards: any;
}

export interface BondedPool {
  addresses: PoolAddresses;
  id: number | string;
  memberCounter: string;
  points: string;
  roles: {
    depositor: string;
    nominator: string;
    root: string;
    stateToggler: string;
  };
  state: PoolState;
}

export type NominationStatuses = { [key: string]: string };

export interface ActivePoolsContextState {
  isBonding: () => boolean;
  isNominator: () => boolean;
  isOwner: () => boolean;
  isMember: () => boolean;
  isDepositor: () => boolean;
  isStateToggler: () => boolean;
  getPoolBondedAccount: () => MaybeAccount;
  getPoolUnlocking: () => any;
  getPoolRoles: () => PoolRoles;
  setTargets: (t: any) => void;
  getNominationsStatus: () => NominationStatuses;
  setSelectedPoolId: (p: string) => void;
  selectedActivePool: ActivePool | null;
  targets: any;
  poolNominations: any;
  synced: Sync;
}

// PoolMembers types
export interface PoolMemberContext {
  fetchPoolMembersMetaBatch: (k: string, v: [], r: boolean) => void;
  queryPoolMember: (w: MaybeAccount) => any;
  getMembersOfPool: (p: number) => any;
  addToPoolMembers: (m: any) => void;
  getPoolMember: (w: MaybeAccount) => any | null;
  removePoolMember: (w: MaybeAccount) => void;
  poolMembers: any;
  meta: AnyMetaBatch;
}

// Misc types
export interface PoolRoles {
  depositor: string;
  nominator: string;
  root: string;
  stateToggler: string;
}

export interface PoolAddresses {
  stash: string;
  reward: string;
}

export type MaybePool = number | null;

export type PoolState = 'open' | 'blocked' | 'destroying';
