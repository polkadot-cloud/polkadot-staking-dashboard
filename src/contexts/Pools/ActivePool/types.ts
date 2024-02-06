// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type BigNumber from 'bignumber.js';
import type { NominationStatuses, PoolAddresses } from '../BondedPools/types';
import type { MaybeAddress } from '@polkadot-cloud/react/types';
import type { Nominations } from 'contexts/Bonded/types';
import type { Identity, SuperIdentity } from 'contexts/Validators/types';

export interface ActivePoolContextState {
  isBonding: () => boolean;
  isNominator: () => boolean;
  isOwner: () => boolean;
  isMember: () => boolean;
  isDepositor: () => boolean;
  isBouncer: () => boolean;
  getPoolBondedAccount: () => MaybeAddress;
  getPoolUnlocking: () => PoolUnlocking[];
  getPoolRoles: () => PoolRoles;
  getNominationsStatus: () => NominationStatuses;
  setActivePoolId: (p: string) => void;
  activePool: ActivePool | null;
  poolNominations: Nominations | null;
  activePoolMemberCount: number;
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
