// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { PoolUnlocking } from '../ActivePools/types';

export interface PoolMembershipsContextState {
  memberships: PoolMembership[];
  membership: PoolMembership | null;
  claimPermissionConfig: ClaimPermissionConfig[];
}

export type ClaimPermission =
  | 'Permissioned'
  | 'PermissionlessCompound'
  | 'PermissionlessWithdraw'
  | 'PermissionlessAll';

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

// PoolMembers types
export interface ClaimPermissionConfig {
  label: string;
  value: ClaimPermission;
  description: string;
}
