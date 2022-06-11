// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MaybeAccount } from 'types';

export interface PoolsConfigContextState {
  enabled: number;
  stats: any;
}

export interface BondedPoolsContextState {
  fetchPoolsMetaBatch: (k: string, v: [], r?: boolean) => void;
  createAccounts: (p: number) => any;
  bondedPools: any;
  meta: any;
}

export interface PoolMembershipsContextState {
  memberships: any;
  membership: any;
}

export interface PoolsContextState {
  isBonding: () => any;
  isNominator: () => any;
  isOwner: () => any;
  isDepositor: () => any;
  getPoolBondedAccount: () => any;
  getPoolBondOptions: (a: MaybeAccount) => any;
  getPoolUnlocking: () => any;
  setTargets: (targest: any) => void;
  getNominationsStatus: () => any;
  activeBondedPool: any;
  targets: any;
  poolNominations: any;
}

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
