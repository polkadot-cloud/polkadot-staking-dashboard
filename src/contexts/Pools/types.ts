// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { AnyFilter } from 'library/Filter/types';
import type { AnyApi, AnyJson, AnyMetaBatch, MaybeAddress, Sync } from 'types';

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

export type ClaimPermission =
  | 'Permissioned'
  | 'PermissionlessCompound'
  | 'PermissionlessWithdraw'
  | 'PermissionlessAll';

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

// PoolMemberships types
export interface PoolMembershipsContextState {
  memberships: PoolMembership[];
  membership: PoolMembership | null;
  claimPermissionConfig: ClaimPermissionConfig[];
}

export interface PoolMembership {
  address: string;
  poolId: number;
  points: string;
  balance: BigNumber;
  lastRecordedRewardCounter: string;
  unbondingEras: Record<number, string>;
  claimPermission: ClaimPermission;
  unlocking: PoolUnlocking[];
}

// BondedPool types
export interface BondedPoolsContextState {
  queryBondedPool: (p: number) => AnyApi;
  getBondedPool: (p: number) => BondedPool | null;
  updateBondedPools: (p: BondedPool[]) => void;
  addToBondedPools: (p: BondedPool) => void;
  removeFromBondedPools: (p: number) => void;
  getPoolNominationStatus: (n: MaybeAddress, o: MaybeAddress) => AnyApi;
  getPoolNominationStatusCode: (t: NominationStatuses | null) => string;
  getAccountRoles: (w: MaybeAddress) => AnyApi;
  getAccountPools: (w: MaybeAddress) => AnyApi;
  replacePoolRoles: (poolId: number, roleEdits: AnyJson) => void;
  poolSearchFilter: (l: AnyFilter, v: string) => void;
  bondedPools: BondedPool[];
  poolsMetaData: Record<number, string>;
  poolsNominations: Record<number, PoolNominations>;
  updatePoolNominations: (id: number, nominations: string[]) => void;
}

export interface ActivePool {
  id: number;
  addresses: PoolAddresses;
  bondedPool: ActiveBondedPool;
  rewardPool: RewardPool;
  rewardAccountBalance: BigNumber;
  pendingRewards: BigNumber;
}

export type BondedPool = ActiveBondedPool & {
  addresses: PoolAddresses;
  id: number;
  commission?: {
    current?: AnyJson | null;
    max?: AnyJson | null;
    changeRate: {
      maxIncrease: AnyJson;
      minDelay: AnyJson;
    } | null;
    throttleFrom?: AnyJson | null;
  };
};

export interface ActiveBondedPool {
  points: string;
  memberCounter: string;
  roles: PoolRoles;
  state: PoolState;
}

export interface RewardPool {
  lastRecordedRewardCounter: string;
  lastRecordedTotalPayouts: string;
  totalCommissionClaimed: string;
  totalCommissionPending: string;
  totalRewardsClaimed: string;
}

export type PoolNominations = {
  submittedIn: string;
  suppressed: boolean;
  targets: string[];
} | null;

export type NominationStatuses = Record<string, string>;

export interface ActivePoolsContextState {
  isBonding: () => boolean;
  isNominator: () => boolean;
  isOwner: () => boolean;
  isMember: () => boolean;
  isDepositor: () => boolean;
  isBouncer: () => boolean;
  getPoolBondedAccount: () => MaybeAddress;
  getPoolUnlocking: () => PoolUnlocking[];
  getPoolRoles: () => PoolRoles;
  setTargets: (t: PoolTargets) => void;
  getNominationsStatus: () => NominationStatuses;
  setSelectedPoolId: (p: string) => void;
  selectedActivePool: ActivePool | null;
  targets: PoolTargets;
  poolNominations: any;
  synced: Sync;
  selectedPoolMemberCount: number;
}

// PoolMembers types
export interface PoolMemberContext {
  fetchPoolMembersMetaBatch: (k: string, v: AnyMetaBatch[], r: boolean) => void;
  queryPoolMember: (w: MaybeAddress) => any;
  getMembersOfPoolFromNode: (p: number) => any;
  addToPoolMembers: (m: any) => void;
  removePoolMember: (w: MaybeAddress) => void;
  getPoolMemberCount: (p: number) => number;
  poolMembersNode: any;
  meta: AnyMetaBatch;
  poolMembersApi: PoolMember[];
  setPoolMembersApi: (p: PoolMember[]) => void;
  fetchedPoolMembersApi: Sync;
  setFetchedPoolMembersApi: (s: Sync) => void;
}

// Misc types
export interface PoolRoles {
  depositor?: string;
  nominator?: string;
  root?: string;
  bouncer?: string;
}

export interface PoolAddresses {
  stash: string;
  reward: string;
}

export type PoolUnlocking = {
  era: number;
  value: BigNumber;
};

export type PoolTargets = Record<number, AnyJson>;

export type MaybePool = number | null;

export type PoolState = 'Open' | 'Blocked' | 'Destroying';

export interface ClaimPermissionConfig {
  label: string;
  value: ClaimPermission;
  description: string;
}

export interface PoolMember {
  poolId: number;
  who: string;
}
