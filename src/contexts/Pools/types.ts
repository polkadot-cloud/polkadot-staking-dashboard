// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { AnyApi, AnyMetaBatch, MaybeAccount } from 'types';

// PoolsConfig types
export interface PoolsConfigContextState {
  enabled: number;
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
  rewardPoolTotalEarnings: string;
  unbondingEras: any;
  unlocking: any;
}

// BondedPool types
export interface BondedPoolsContextState {
  fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => void;
  createAccounts: (p: number) => PoolAddresses;
  getBondedPool: (p: number) => BondedPool | null;
  bondedPools: Array<BondedPool>;
  meta: AnyMetaBatch;
}

export interface ActiveBondedPoolState {
  pool: BondedPool | undefined;
  unsub: AnyApi;
}

export interface BondedPool {
  addresses: PoolAddresses;
  id: number;
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

export interface ActivePoolContextState {
  isBonding: () => boolean;
  isNominator: () => boolean;
  isOwner: () => boolean;
  isDepositor: () => boolean;
  getPoolBondedAccount: () => MaybeAccount;
  getPoolBondOptions: (a: MaybeAccount) => any;
  getPoolUnlocking: () => any;
  setTargets: (t: any) => void;
  getNominationsStatus: () => any;
  activeBondedPool: any;
  targets: any;
  poolNominations: any;
}

// Misc types

export interface PoolAddresses {
  stash: string;
  reward: string;
}

export type MaybePool = number | null;

export enum PoolState {
  /// The pool is open to be joined, and is working normally.
  Open = 'Open',
  /// The pool is blocked. No one else can join.
  Block = 'Blocked',
  /// The pool is in the process of being destroyed.
  ///
  /// All members can now be permissionlessly unbonded, and the pool can never go back to any
  /// other state other than being dissolved.
  Destroy = 'Destroying',
}
