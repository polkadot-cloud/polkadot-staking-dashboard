// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { PoolAddresses } from '../BondedPools/types';
import type { MaybeAddress } from '@w3ux/react-connect-kit/types';
import type { Identity, SuperIdentity } from 'contexts/Validators/types';
import type { Nominations } from 'contexts/Balances/types';

export interface ActivePoolContextState {
  isBonding: () => boolean;
  isNominator: () => boolean;
  isOwner: () => boolean;
  isMember: () => boolean;
  isDepositor: () => boolean;
  isBouncer: () => boolean;
  getPoolUnlocking: () => PoolUnlocking[];
  getPoolRoles: () => PoolRoles;
  setActivePoolId: (p: string) => void;
  activePool: ActivePool | null;
  activePoolNominations: Nominations | null;
  pendingPoolRewards: BigNumber;
}

export interface ActivePool {
  id: number;
  addresses: PoolAddresses;
  bondedPool: ActiveBondedPool;
  rewardPool: RewardPool;
  rewardAccountBalance: BigNumber;
}

export interface ActiveBondedPool {
  points: string;
  memberCounter: string;
  roles: PoolRoles;
  roleIdentities: {
    identities: Record<string, Identity>;
    supers: Record<string, SuperIdentity>;
  };
  state: PoolState;
}

export interface RewardPool {
  lastRecordedRewardCounter: string;
  lastRecordedTotalPayouts: string;
  totalCommissionClaimed: string;
  totalCommissionPending: string;
  totalRewardsClaimed: string;
}

export type PoolState = 'Open' | 'Blocked' | 'Destroying';

export interface PoolUnlocking {
  era: number;
  value: BigNumber;
}

export type PoolRole = 'depositor' | 'nominator' | 'root' | 'bouncer';

export interface PoolRoles {
  depositor?: MaybeAddress;
  nominator?: MaybeAddress;
  root?: MaybeAddress;
  bouncer?: MaybeAddress;
}
